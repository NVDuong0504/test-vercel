/* eslint-disable no-useless-catch */
import Joi, { valid } from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '../config/mongodb'

const CLASS_COLLECTION_NAME = 'classes'
const CLASS_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(20).trim().strict(),
  tuitionFee: Joi.number().required().min(0),
  createAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data)=>{
  return await CLASS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const validateBeforeUpdate = async (data)=>{
  return await CLASS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdClass = await GET_DB().collection(CLASS_COLLECTION_NAME).insertOne(validData)
    return createdClass
  } catch (error) {
    throw new Error(error)
  }  
}

const getAll = async () => {
  try {
    const result = await GET_DB().collection(CLASS_COLLECTION_NAME).find({}).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CLASS_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })

    return result
  } catch (error) {
    throw error
  }
}

const deleteOne = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CLASS_COLLECTION_NAME)
      .deleteOne({ '_id': new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async ( id, data ) => {
  try {
    const validData = await validateBeforeUpdate(data)
    const classId = new ObjectId(id)
    delete validData.createAt
    const updateResult = await GET_DB().collection(CLASS_COLLECTION_NAME).updateOne({ _id: classId }, { $set: {...validData} })
    const updatedClass = await findOneById(id)
    return updatedClass
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByIds = async (classIds) => {
  const correctIds = Joi.array().items(Joi.string().hex().length(24))
  try {
    await correctIds.validateAsync(classIds)
    const objClassIds = classIds.map(id => new ObjectId(id))
    const result = await GET_DB()
      .collection(CLASS_COLLECTION_NAME)
      .deleteMany({ _id: { $in: objClassIds } })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const classModel = {
  CLASS_COLLECTION_NAME,
  CLASS_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteOne,
  getAll,
  updateOneById,
  deleteManyByIds
}
