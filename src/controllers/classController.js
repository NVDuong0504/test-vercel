import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { classService } from '../services/classService'

const createNew = async (req, res, next) =>{

  try {
    const createdClass = await classService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdClass)
  } catch (error) {
    next(error)
  }

}

const getAll = async (req, res, next) => {
  try {
    const result = await classService.getAll()
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await classService.getDetail(id)
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await classService.deleteOne(id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateOneById = async ( req, res, next ) => {
  try {
    const id = new ObjectId(req.params.id)
    const result = await classService.updateOneById(id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteMany = async(req, res, next) => {
  try {
    const result = await classService.deleteMany(req.body.classIds)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const classController = {
  createNew,
  getDetail,
  deleteOne,
  updateOneById,
  getAll,
  deleteMany
}
