import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { classValidation } from '../validations/classValidation'
import { classController } from '../controllers/classController'

const Router = express.Router()


Router.route('/')
  .get(classController.getAll)
  .post(classValidation.createNew, classController.createNew)
  .delete(classValidation.deleteMany, classController.deleteMany)
Router.route('/:id')
  .get(classController.getDetail)
  .put(classValidation.updateOne, classController.updateOneById)
  .delete(classController.deleteOne)

export const classRoutes = Router
