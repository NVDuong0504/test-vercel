import { StatusCodes } from 'http-status-codes'
import { enrollService } from '../services/enrollService'


const createNew = async ( req, res, next ) => {
  try {
    const result = await enrollService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error)
  }
}

const getALL = async(req, res, next) => {
  try {
    const result = await enrollService.getAll()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getByClassId = async(req, res, next) => {
  try {
    const id = req.params.id
    const result = await enrollService.getByClassId(id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getClassDetail = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await enrollService.getClassDetail(id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await enrollService.deleteOne(req.body);
    res.status(StatusCodes.OK).json({result})
  } catch (error) {
    next(error)
  }
}

export const enrollController = {
  getALL,
  createNew,
  deleteOne,
  getByClassId,
  getClassDetail
}