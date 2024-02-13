import express from 'express'
import { StudentController } from '../../controllers/studentController'
import { studentValidation } from '../../validations/studentValidation'

const Router = express.Router();

Router.route('/')
  .get(StudentController.getAll)
  .post(studentValidation.createNew, StudentController.createNew)
  .delete(studentValidation.deleteByStudentIds, StudentController.deleteManyByIds)

Router.route('/:id')
  .get(StudentController.findOneById)
  .delete(StudentController.deleteOneById)
  .put(studentValidation.updateOneById, StudentController.updateOneById)

export const StudentRoutes = Router