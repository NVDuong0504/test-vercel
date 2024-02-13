import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '../config/mongodb'
import { StudentModel } from './studentModel'
import { classModel } from './classModel'

const CORRECT_ID = Joi.string().hex().length(24)
const ATTENDANCE_COLLECTION_NAME = 'attendance'
const ATTENDANCE_COLLECTION_SCHEMA = Joi.object({
  classId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24).required(),
  dates: Joi.array().items(Joi.date()).default([])
})

const getClass = async ( data ) => {
  try {
    const ObjectIdCondition = Joi.object({
      classId : Joi.string().hex().length(24).required(),
      date: Joi.date().required()
    })
    const validData = await ObjectIdCondition.validateAsync(data, {abortEarly: false})
    const classId = new ObjectId(validData.classId)
    const result = await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .find({ classId, dates: { $elemMatch: { $eq: validData.date } } }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validData = await ATTENDANCE_COLLECTION_SCHEMA.validateAsync(data)
    validData.classId = new ObjectId(validData.classId)
    validData.studentId = new ObjectId(validData.studentId)
    const result = await GET_DB().collection(ATTENDANCE_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addDate = async (data) => {
  try {
    const correctCondition = Joi.object({
      classId: Joi.string().hex().length(24).required(),
      studentId: Joi.string().hex().length(24).required(),
      dates: Joi.array().items(Joi.date()).required()
    })
    const validData = await correctCondition.validateAsync(data, { abortEarly: false })
    validData.classId = new ObjectId(validData.classId)
    validData.studentId = new ObjectId(validData.studentId)
    await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .updateOne(
        { classId: new ObjectId(validData.classId), studentId: new ObjectId(validData.studentId) },
        { $addToSet:{ dates: {$each: validData.dates } } }
      )
    const updatedRecord = await GET_DB().collection(ATTENDANCE_COLLECTION_NAME)
      .findOne({ classId: validData.classId, studentId: validData.studentId })
    return updatedRecord
  } catch (error) {
    throw new Error(error)
  }
}

const removeDate = async (data) => {
  try {
    const correctCondition = Joi.object({
      classId: Joi.string().hex().length(24).required(),
      studentId: Joi.string().hex().length(24).required(),
      dates: Joi.array().items(Joi.date()).required()
    })
    const validData = await correctCondition.validateAsync(data, { abortEarly: false })
    validData.classId = new ObjectId(validData.classId)
    validData.studentId = new ObjectId(validData.studentId)
    await GET_DB().collection(ATTENDANCE_COLLECTION_NAME)
      .updateOne(
        { classId: validData.classId, studentId: validData.studentId },
        { $pullAll : { dates: validData.dates } }
      )
    const updatedRecord = await GET_DB().collection(ATTENDANCE_COLLECTION_NAME)
      .findOne({ classId: validData.classId, studentId: validData.studentId })
    return updatedRecord
  } catch (error) {
    throw new Error(error)
  }
}

const updateClass = async (data) => {
  const correctCondition = Joi.object({
    classId: Joi.string().length(24).hex().required(),
    date : Joi.date().required(),
    studentIds: Joi.array().items(Joi.string().hex().length(24)).default([]).required()
  })
  try {
    const validData = await correctCondition.validateAsync(data, {abortEarly: false})
    validData.classId = new ObjectId(validData.classId)
    validData.studentIds = validData.studentIds.map((item) => {return new ObjectId(item)})
    await GET_DB().collection(ATTENDANCE_COLLECTION_NAME)
      .updateMany(
        { classId: validData.classId, studentId: { $in: validData.studentIds } },
        { $addToSet: { dates:validData.date } }
      )
    await GET_DB().collection(ATTENDANCE_COLLECTION_NAME)
      .updateMany(
        { classId: validData.classId, studentId: { $nin:validData.studentIds } },
        { $pull: { dates: validData.date } }
      )
    const classAttendanceResult = await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .find({ classId: new ObjectId(validData.classId) }).toArray()
    return classAttendanceResult
  } catch (error) {
    throw new Error(error)
  }
}

const getClassAttendanceByMonth = async (data) => {
  const correctCondition = Joi.object({
    classId: Joi.string().hex().length(24).required(),
    month: Joi.number().required(),
    year: Joi.number().required()
  })

  try {
    const validData = await correctCondition.validateAsync(data, {abortEarly: false})
    const classId = new ObjectId(validData.classId)
    const startDate = new Date(validData.year, validData.month - 1, 1)
    const finishDate = new Date(validData.year, validData.month, 0)
    const result = GET_DB()
      .collection(AttendanceModel.ATTENDANCE_COLLECTION_NAME)
      .aggregate([
        { $match:{ classId } },
        {
          $lookup:{
            from: StudentModel.STUDENT_COLLECTION_NAME,
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $lookup:{
            from: classModel.CLASS_COLLECTION_NAME,
            localField: 'classId',
            foreignField: '_id',
            as: 'class'
          }
        },
        {
          $unwind:{
            path:'$student'
          },
        },
        {
          $unwind:{
            path:'$class'
          },
        },
        {
          $project: {
            student: '$student',
            class: '$class',
            dates: {
              $filter: {
                input: '$dates',
                as: 'item',
                cond: {
                  $and: [
                    { $gte: ['$$item', startDate] },
                    { $lte: ['$$item', finishDate] }
                  ]
                }
              }
            }
          }
        }
      ]
      )
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getStudentMonthAttendance = async (data) => {
  try {
    const classId = new ObjectId(data.classId);
    const studentId = new ObjectId(data.studentId);
    const month = data.month
    const year = data.year
    const startDate = new Date(year, month - 1, 1)
    const finishDate = new Date(year, month, 0)
    const result = await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .aggregate([
        { $match: {
          classId: new ObjectId(classId),
          studentId: new ObjectId(studentId)
        } },
        {
          $lookup: {
            from: StudentModel.STUDENT_COLLECTION_NAME,
            localField: 'studentId',
            foreignField: '_id',
            as: 'studentInfo'
          }
        },
        {
          $unwind:
            {
              path: '$studentInfo'
            }
        },
        {
          $project: {
            studentId:'$studentId',
            studentInfo: '$studentInfo',
            classId:'$classId',
            month: month,
            year: year,
            monthAttendances:{
              $filter: {
                input: '$dates',
                as: 'date',
                cond: { $and:[
                  { $gte: ['$$date', startDate] },
                  { $lte: ['$$date', finishDate] }
                ] }
              }
            }
          }
        }
      ])
      .toArray()
    if (result.length > 0) return result[0]
    return null
  } catch (error) {
    throw new error(error)
  }
}

const updateClassOfStudent = async (studentId, classId) => {
  try {
    await CORRECT_ID.validateAsync(studentId)
    await CORRECT_ID.validateAsync(classId)
    const updateResult =await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          studentId: new ObjectId(studentId)
        },
        { $set: {
          classId: new ObjectId(classId) }
        })
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByClassId = async (classId) => {
  try {
    await CORRECT_ID.validateAsync(classId)
    const result = GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .deleteMany({ classId: new ObjectId(classId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentId = async (studentId) => {
  try {
    await CORRECT_ID.validateAsync(studentId)
    const result = GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .deleteMany({ studentId: new ObjectId(studentId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  const correctCondition = Joi.array().items(Joi.string().hex().length(24))
  try {
    await correctCondition.validateAsync(ids)
    const studentIds = ids.map(item => new ObjectId(item))
    const deleteResult = await GET_DB()
      .collection(ATTENDANCE_COLLECTION_NAME)
      .deleteMany({ studentId:{ $in: studentIds } })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

export const AttendanceModel = {
  ATTENDANCE_COLLECTION_SCHEMA,
  ATTENDANCE_COLLECTION_NAME,
  getClass,
  createNew,
  addDate,
  removeDate,
  updateClass,
  getClassAttendanceByMonth,
  getStudentMonthAttendance,
  updateClassOfStudent,
  deleteByClassId,
  deleteByStudentId,
  deleteByStudentIds
}