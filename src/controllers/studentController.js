import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { studentService } from '../services/studentService'

const createNew = async ( req, res, next ) => {
  try {
    const result = await studentService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const findOneById = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id)
    const reuslt = await studentService.findOneById(new ObjectId(id))
    res.status(StatusCodes.OK).json(reuslt)
  } catch (error) {
    next(error)
  }
}

const getAll = async ( req, res, next) => {
  try {
    const result = await studentService.getAll()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteOneById = async (req, res, next) => {
  try {
    const id = req.params.id
    const deleteRecord = await studentService.deleteOneById(id)
    res.status(StatusCodes.OK).json(deleteRecord)
  } catch (error) {
    next(error)
  }
}

const updateOneById = async (req, res, next) => {
  try {
    const studentId =req.params.id
    const updateResult = await studentService.updateOneById( studentId, req.body )
    res.status(StatusCodes.OK).json(updateResult)
  } catch (error) {
    next(error)
  }
}

const deleteManyByIds = async (req, res, next) => {
  try {
    const result = await studentService.deleteManyByIds(req.body.studentIds)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const StudentController = {
  getAll,
  createNew,
  findOneById,
  deleteOneById,
  updateOneById,
  deleteManyByIds
}