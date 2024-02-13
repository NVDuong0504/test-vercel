import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const calcClassTuitionFee = async ( req, res, next ) => {
  const correctCondition = Joi.object({
    classId: Joi.string().hex().length(24).required(),
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().min(2024).max(new Date().getFullYear()).required()
  })
  try {
    await correctCondition.validateAsync( req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customError)
  }
}

const handlePaid = async(req, res, next) => {
  const data = req.body;
  const correctCondition = Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    classId: Joi.string().hex().length(24).required(),
    month: Joi.number().required().max(12).min(1),
    year: Joi.number().required().min(2024).max(Number(new Date().getFullYear()))
  })
  try {
    await correctCondition.validateAsync(data, {abortEarly: false})
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

const getTuitionFeeByStudentId = async (req, res, next) => {
  const correctId = Joi.object({
    studentId: Joi.string().hex().length(24).required()
  })
  const correctMonth = Joi.object({
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().min(2024).max(new Date().getFullYear()).required()
  })

  try {
    const studentId = req.params.id
    const q = req.query
    const monthStart = {
      month: q.monthStart,
      year: q.yearStart
    }
    const monthFinish = {
      month: q.monthFinish,
      year: q.yearFinish
    }

    await correctId.validateAsync({ studentId })
    await correctMonth.validateAsync(monthStart, { abortEarly: false })
    await correctMonth.validateAsync(monthFinish, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

const updatePaidByIds = async (req, res, next) => {
  const correctCondition = Joi.object({
    ids: Joi.array().items(Joi.string().hex().length(24)).required()
  })
  try {
    const ids = req.body.ids
    await correctCondition.validateAsync({ids}, {abortEarly: false })
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

export const TuitionFeeValidation = {
  calcClassTuitionFee,
  handlePaid,
  getTuitionFeeByStudentId,
  updatePaidByIds
}