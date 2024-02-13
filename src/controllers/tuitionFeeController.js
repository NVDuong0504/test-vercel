import { StatusCodes } from 'http-status-codes'
import { TuitionFeeService } from '../services/tuitionFee'

const calcClassTuitionFee = async ( req, res, next ) => {
  try {
    const result = await TuitionFeeService.calcClassTuitionFee(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getClassTuitionFeeDetail = async ( req, res, next ) => {
  try {
    const result = await TuitionFeeService.getClassTuitionFeeDetail(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const handlePaid = async (req, res, next) => {
  try {
    const result = await TuitionFeeService.handlePaid(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getTuitionFeeByStudentId = async (req, res, next) => {
  try {
    const result = await TuitionFeeService.getTuitionFeeByStudentId(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getTuitionFeePaidByStudentId = async(req, res, next) => {
  try {
    const result = await TuitionFeeService.getTuitionFeePaidByStudentId(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getTuitionFeeNotPaidByStudentId = async(req, res, next) => {
  try {
    const result = await TuitionFeeService.getTuitionFeeNotPaidByStudentId(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updatePaidByIds = async (req, res, next) => {
  try {
    const result = await TuitionFeeService.updatePaidByIds(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const TuitionFeeController = {
  calcClassTuitionFee,
  getClassTuitionFeeDetail,
  handlePaid,
  getTuitionFeeByStudentId,
  getTuitionFeePaidByStudentId,
  getTuitionFeeNotPaidByStudentId,
  updatePaidByIds
}