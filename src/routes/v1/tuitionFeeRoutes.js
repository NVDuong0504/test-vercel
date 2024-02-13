import express from 'express'
import { TuitionFeeController } from '~/controllers/tuitionFeeController'
import { TuitionFeeValidation } from '~/validations/tuitionFeeVaidation'

const Router = express.Router()

Router.route('/:id')
  .get(TuitionFeeController.getClassTuitionFeeDetail)
Router.route('/calc')
  .post(TuitionFeeValidation.calcClassTuitionFee, TuitionFeeController.calcClassTuitionFee)
Router.route('/paid')
  .post(TuitionFeeValidation.handlePaid, TuitionFeeController.handlePaid)
  .patch(TuitionFeeValidation.updatePaidByIds, TuitionFeeController.updatePaidByIds)
Router.route('/student/:id')
  .get(TuitionFeeValidation.getTuitionFeeByStudentId, TuitionFeeController.getTuitionFeeByStudentId)
Router.route('/student/:id/paid')
  .get(TuitionFeeValidation.getTuitionFeeByStudentId, TuitionFeeController.getTuitionFeePaidByStudentId)
Router.route('/student/:id/notPaid')
  .get(TuitionFeeValidation.getTuitionFeeByStudentId, TuitionFeeController.getTuitionFeeNotPaidByStudentId)
export const TuitionFeeRoutes = Router