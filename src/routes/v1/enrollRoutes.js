import express from 'express'
import { enrollController } from '../controllers/enrollController';
import { enrollValidation } from '../validations/enrollValidation';

const Router = express.Router();

Router.route('/')
  .post(enrollValidation.createNew, enrollController.createNew)
  .delete(enrollValidation.deleteOne, enrollController.deleteOne)
Router.route('/:id')
  .get(enrollValidation.getByClassId, enrollController.getClassDetail)
export const EnrollRoutes = Router