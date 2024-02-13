import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '../utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    'classId': Joi.string().hex().length(24).required(),
    'name' : Joi.string().required().max(255).min(2),
    'phone': Joi.string().trim().strict().allow('').min(10),
    'parentName': Joi.string().max(50),
    'parentPhone': Joi.string().trim().strict().allow('').min(10)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

const updateOneById = async (req, res, next) => {
  const correctCondition = Joi.object({
    'classId': Joi.string().hex().length(24),
    'name' : Joi.string().required().max(255).min(2),
    'phone': Joi.string().min(10),
    'parentName': Joi.string().max(50),
    'parentPhone': Joi.string().trim().strict().allow('').min(10)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

const deleteByStudentIds = async (req, res, next) => {
  const correctCondition = Joi.array().items(Joi.string().hex().length(24)).required()
  try {
    const studentIds = req.body.studentIds
    await correctCondition.validateAsync(studentIds)
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

export const studentValidation = {
  createNew,
  updateOneById,
  deleteByStudentIds
}