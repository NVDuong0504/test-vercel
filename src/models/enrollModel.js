import Joi, { object } from 'joi'
import { GET_DB } from '~/config/mongodb'
import { StudentModel } from './studentModel'
import { classModel } from './classModel'
import { ObjectId } from 'mongodb'

const ENROLL_COLECTION_NAME = 'enrolls'
const ENROLL_COLECTION_SCHEMA = Joi.object({
  studentId: Joi.required(),
  classId: Joi.required()
})

const correctId = Joi.string().hex().length(24).required()
const createNew = async (data) => {
  try {
    await ENROLL_COLECTION_SCHEMA.validateAsync(data, {abortEarly: false})
    const inserted = await GET_DB().collection(ENROLL_COLECTION_NAME).insertOne(data);
    return inserted
  } catch (error) {
    throw new Error(error)
  }
}
const getAll = async () => {
  try {
    const result = await GET_DB().collection(ENROLL_COLECTION_NAME).aggregate([
      { $match: {} },
      { $lookup: {
        from: StudentModel.STUDENT_COLLECTION_NAME,
        localField: 'studentId',
        foreignField: '_id',
        as: 'studentDetail'
      } },
      { $lookup: {
        from: classModel.CLASS_COLLECTION_NAME,
        localField: 'classId',
        foreignField: '_id',
        as: 'classInfor'
      } },
      { $sort: { classId:1 } }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getClassDetail = async (classId) => {
  try {
    const result = await GET_DB().collection(ENROLL_COLECTION_NAME).aggregate(
      [
        { $match: { classId:classId } },
        { $lookup: {
          from: StudentModel.STUDENT_COLLECTION_NAME,
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentDetail'
        } },
        { $lookup: {
          from: classModel.CLASS_COLLECTION_NAME,
          localField: 'classId',
          foreignField: '_id',
          as: 'classInfor'
        }}
      ]
    )
    return result.toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getByClassId = async (classId) => {
  try {
    const result = await GET_DB().collection(ENROLL_COLECTION_NAME).find({ classId }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getByClassIds = async (classIds) => {
  const correctIds = Joi.array().items(Joi.string().hex().length(24))
  try {
    await correctIds.validateAsync(classIds)
    const objClassIds = classIds.map(item => new ObjectId(item))
    const result = await GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .find({ classId: { $in: objClassIds } })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateStudentErroll = async( studentId, classId ) => {
  const correctId = Joi.string().hex().length(24).required()
  try {
    const validStudentId = await correctId.validateAsync(studentId)
    const validClassId = await correctId.validateAsync(classId)
    await GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .findOneAndUpdate(
        { studentId: new ObjectId(validStudentId) },
        { $set: { classId: new ObjectId(validClassId) } }
      )
    const enrollUpdated = await GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .findOne({ studentId: new ObjectId(validStudentId) })

    return enrollUpdated
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentId = async(studentId) => {
  try {
    await correctId.validateAsync(studentId)
    const result = await GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .deleteMany({ studentId: new ObjectId(studentId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByClassId = async (classId) => {
  try {
    await correctId.validateAsync(classId)
    const result = await GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .deleteMany({ classId: new ObjectId(classId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  const correctIds = Joi.array().items(Joi.string().hex().required()).required()
  try {
    await correctIds.validateAsync(ids)
    const studentIds = ids.map(item => {return new ObjectId(item)})
    const deleteResult = GET_DB()
      .collection(ENROLL_COLECTION_NAME)
      .deleteMany({ studentId: { $in : studentIds } })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

export const EnrollModel = {
  ENROLL_COLECTION_NAME,
  ENROLL_COLECTION_SCHEMA,
  createNew,
  getAll,
  getByClassId,
  getClassDetail,
  updateStudentErroll,
  deleteByStudentId,
  deleteByClassId,
  deleteByStudentIds,
  getByClassIds
}