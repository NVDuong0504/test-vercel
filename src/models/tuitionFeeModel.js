import Joi, { func, valid } from 'joi'
import { GET_DB } from '~/config/mongodb'
import { AttendanceModel } from './attendanceModel'
import { ObjectId } from 'mongodb'
import { StudentModel } from './studentModel'
import { classModel } from './classModel'

const TUITION_FEE_CONNECTION_NAME = 'tuitionFee'
const TUITION_FEE_CONNECTION_SCHEMA = Joi.object({
  studentId: Joi.object().required(),
  classId: Joi.object().required(),
  month: Joi.number().min(1).max(12).required(),
  year: Joi.number().min(2024).max(new Date().getFullYear()).required(),
  count: Joi.number().required().min(0).default(0),
  amountTuitionFee: Joi.number().min(0).required(),
})

const CORRECT_ID = Joi.string().hex().length(24).required()

const writeClassTuitionFee = async (data, classId, month, year) => {
  try {
    const validData = await Joi.array().items(TUITION_FEE_CONNECTION_SCHEMA).validateAsync(data, { abortEarly: false })
    for (const item of validData) {
      await GET_DB()
        .collection(TUITION_FEE_CONNECTION_NAME)
        .updateOne(
          {
            classId: new ObjectId(item.classId), 
            studentId: new ObjectId(item.studentId),
            month,
            year
          },
          { $set:item },
          { upsert: true }
        )
    }
    return { message: 'success' }
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

const getClassTuitionFeeDetail = async (data) => {
  try {
    const classId = new ObjectId(data.classId);
    const year = data.year;
    const month = data.month;
    const result = await GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .aggregate([
        { $match:{
          classId,
          year: Number(year),
          month: Number(month)
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
          $lookup: {
            from: classModel.CLASS_COLLECTION_NAME,
            localField: 'classId',
            foreignField: '_id',
            as: 'classInfo'
          }
        },
        {
          $unwind:{path:'$studentInfo'}
        },
        {
          $unwind:{path:'$classInfo'}
        }
        
      ])
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }

}

const handlePaid = async (studentId, classId, month, year) => {
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId : Joi.string().hex().length(24).required(),
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().min(2024).max(Number(new Date().getFullYear())).required()
  })
  try {
    const validData = await correctCondition.validateAsync({ studentId, classId, month, year })
    const updateResult = await GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .findOneAndUpdate(
        {
          studentId: new ObjectId(validData.studentId),
          classId: new ObjectId(validData.classId),
          month: validData.month,
          year: validData.year
        },
        { $set:{ isPaid: true } },
        { returnNewDocument: true }
      )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentId = async (studentId) => {
  try {
    await CORRECT_ID.validateAsync(studentId)
    const result = GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .deleteMany({ studentId: new ObjectId(studentId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByClassId = async (classId) => {
  try {
    await CORRECT_ID.validateAsync(classId)
    const result = GET_DB().
      collection(TUITION_FEE_CONNECTION_NAME)
      .deleteMany({ classId: new ObjectId(classId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  const correctCondition = Joi.array().items(Joi.string().hex().length(24)).required()
  try {
    await correctCondition.validateAsync(ids)
    const studentIds = ids.map(id => new ObjectId(id))
    const deleteResult = GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .deleteMany({ studentId:{ $in:studentIds } } )
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

const getTuitionFeeByStudentId = async (studentId) => {
  try {
    const result = await GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .aggregate([
        { $match:{ studentId: new ObjectId(studentId) } },
        {
          $lookup: {
            from: 'students',
            as: 'student',
            localField: 'studentId',
            foreignField: '_id'
          }
        },
        { $unwind: '$student'},
        { $sort : { year: -1, month : -1 } }
      ])
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getStudentTuitionFeeByMonths = async ( studentId, months) => {
  try {
    const monthString = months.map(month=> `${month.year}${month.month}`)
    const result = await GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .aggregate([
        {
          $match: { studentId: new ObjectId(studentId) },
        },
        { $addFields:{ monthString: { $concat:[{$toString:'$year' }, { $toString:'$month' }]}}},
        {
          $match: { monthString:{ $in:monthString } }
        }
      ]
      ).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updatePaidByIds = async (ids) => {
  const correctCondition = Joi.object({
    ids: Joi.array().items(Joi.string().hex().length(24)).required()
  })
  try {
    const validIds = await correctCondition.validateAsync({ids})
    const idObjects = validIds.ids.map( id => new ObjectId(id))
    const result = await GET_DB()
      .collection(TUITION_FEE_CONNECTION_NAME)
      .updateMany(
        { _id:{ $in:idObjects } },
        { $set:{ isPaid:true } }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const TuitionFeeModel = {
  writeClassTuitionFee,
  getClassAttendanceByMonth,
  getClassTuitionFeeDetail,
  handlePaid,
  deleteByStudentId,
  deleteByClassId,
  deleteByStudentIds,
  getTuitionFeeByStudentId,
  updatePaidByIds,
  getStudentTuitionFeeByMonths
}