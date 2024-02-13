import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '../utils/ApiError'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    studentId:Joi.string().hex().length(24).required(),
    classId:Joi.string().hex().length(24).required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customErr)
  }
}

const deleteOne = async(req, res, next) =>{ 
  const correctCondition = Joi.object({
    studentId:Joi.string().hex().length(24).required(),
    classId:Joi.string().hex().length(24).required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customErr)
  }
}

const getByClassId = async(req, res, next) => {
  const id = req.params.id
  const correctCondition = Joi.string().hex().length(24).required()
  try {
    await correctCondition.validateAsync(id)
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message)
    next(customErr)
  }
}

export const enrollValidation = {
  createNew,
  deleteOne,
  getByClassId
}