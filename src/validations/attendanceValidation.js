import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '../utils/ApiError'

const getClass = async( req, res, next ) => {
  const classId = req.params.id
  const date = req.query.d
  const correctCondition = Joi.object({
    classId: Joi.string().hex().length(24).required(),
    date: Joi.date().required()
  })
  try {
    await correctCondition.validateAsync({ classId, date })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customErr)
  }
}

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId: Joi.string().hex().length(24)
  })
  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error)
    next(customErr)
  }
}

const addDate = async(req, res, next) => {
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId:Joi.string().hex().length(24),
    dates: Joi.array().items(Joi.date().required())
  })

  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error))
    next(customErr)
  }
}

const removeDate = async (req, res, next) => {
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId:Joi.string().hex().length(24),
    dates: Joi.array().items(Joi.date()).required()
  })
  try {
    await correctCondition.validateAsync( req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error))
    next(customErr)
  }
}

const updateClass = async (req, res, next) => {
  const correctCondition = Joi.object({
    classId:Joi.string().hex().length(24),
    date: Joi.date().required(),
    studentIds: Joi.array().items(Joi.string().hex().length(24)).default([])
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error))
    next(customErr)
  }
}

const updateStudent = async ( req, res, next) => {
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId: Joi.string().hex().length(24).required(),
    datesAdd: Joi.array().items(Joi.date()).required().default([]),
    datesRemove: Joi.array().items(Joi.date()).required().default([])
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customErr = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customErr)
  }
}

export const AttendanceValidation = {
  getClass,
  createNew,
  addDate,
  removeDate,
  updateClass,
  updateStudent
}