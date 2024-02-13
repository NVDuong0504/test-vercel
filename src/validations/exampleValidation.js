import Joi from 'joi'
import {StatusCodes} from 'http-status-codes'

const createNew = async (req, res, next)=>{
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body,{ abortEarly: false})
    //validate hợp lệ thì cho dữ liệu đi tiếp sang controller
    next()
  } catch (err) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: (new Error(err)).message
    })
  }
}

export const exampleValidation = {
  createNew
}