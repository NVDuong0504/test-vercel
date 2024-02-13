import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '../config/mongodb'
import { EnrollModel } from './enrollModel'

const STUDENT_COLLECTION_NAME = 'students'
const STUDENT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().strict().min(2).max(255),
  phone: Joi.string().trim().strict().allow('').min(10),
  parentName: Joi.string().max(50),
  parentPhone: Joi.string().trim().strict().allow('').min(10)
})

const correctId = Joi.string().hex().length(24).required()

const validateBeforeCreate = async (data) => {
  return await STUDENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const validateBeforeUpdate = async (data) => {
  return await STUDENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdStudent = await GET_DB().collection(STUDENT_COLLECTION_NAME).insertOne(validData)
    return createdStudent
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).find({})
    return result.toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    await correctId.validateAsync(id)

    const result = await GET_DB()
      .collection(STUDENT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
    await GET_DB()
    await GET_DB().collection(EnrollModel.ENROLL_COLECTION_NAME)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByIds = async(ids) => {
  const corectCondition = Joi.array().items(Joi.string().hex().length(24))
  try {
    const validIds = await corectCondition.validateAsync(ids, { abortEarly: false })
    const studentIds = validIds.map(id => new ObjectId(id))
    const deleteResult = GET_DB()
      .collection(STUDENT_COLLECTION_NAME)
      .deleteMany({ _id: { $in: studentIds } } )
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    const studentId = new ObjectId(id)
    const validData = await validateBeforeUpdate(data)
    await GET_DB()
      .collection(STUDENT_COLLECTION_NAME)
      .updateOne({ _id: studentId }, { $set:{ ...validData } } )
    const updatedStudent = await findOneById(studentId)
    return updatedStudent
  } catch (error) {
    throw new Error(error)
  }
}

export const StudentModel = {
  STUDENT_COLLECTION_NAME,
  STUDENT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  deleteOneById,
  updateOneById,
  deleteManyByIds
}
