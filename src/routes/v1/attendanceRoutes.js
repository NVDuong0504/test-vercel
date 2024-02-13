import express from 'express'
import { AttendanceController } from '~/controllers/attendanceController'
import { AttendanceValidation } from '~/validations/attendanceValidation'

const Router = express.Router()

Router.route('/class/:id')
  .get(AttendanceValidation.getClass, AttendanceController.getClass)

Router.route('/class')
  .patch(AttendanceValidation.updateClass, AttendanceController.updateClass)

Router.route('/student/')
  .post(AttendanceValidation.createNew, AttendanceController.createNew)

Router.route('/student/:id')
  .get(AttendanceController.getStudentMonthAttendance)

Router.route('/student')
  .patch(AttendanceValidation.updateStudent, AttendanceController.updateStudent)

Router.route('/student/addDates')
  .patch(AttendanceValidation.addDate, AttendanceController.addDate)

Router.route('/student/removeDates')
  .patch(AttendanceValidation.removeDate, AttendanceController.removeDate)

export const AttendanceRouters = Router