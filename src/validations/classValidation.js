import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next )=>{
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(20).trim().strict(),
    tuitionFee: Joi.number().required().min(0)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateOne = async ( req, res, next ) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(20).trim().strict(),
    tuitionFee: Joi.number().required().min(0)
  })
  try {
    await correctCondition.validateAsync( req.body, { abortEarly: false } )
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const deleteMany = async (req, res, next) => {
  const correctCondition = Joi.array().items(Joi.string().hex().length(24)).required()
  try {
    await correctCondition.validateAsync(req.body.classIds)
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)
    next(customError)
  }
}

export const classValidation = {
  createNew,
  updateOne,
  deleteMany
}