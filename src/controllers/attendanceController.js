import { StatusCodes } from 'http-status-codes'
import { AttendanceService } from '../services/attendanceService'


const getClass = async (req, res, next) => {
  try {
    const classId = req.params.id
    const date = req.query.d
    const result = await AttendanceService.getClass({ classId, date })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const result = await AttendanceService.createNew(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const addDate = async ( req, res, next ) => {
  try {
    const result = await AttendanceService.addDate(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const removeDate = async ( req, res, next ) => {
  try {
    const result = await AttendanceService.removeDate(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateClass = async (req, res, next) => {
  try {
    const result = await AttendanceService.updateClass(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getStudentMonthAttendance = async (req, res, next) => {
  try {
    const query = req.query
    const studentId = req.params.id
    const month = query.m
    const year = query.y
    const classId = query.class
    const result = await AttendanceService.getStudentMonthAttendance(studentId, classId, month, year)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateStudent = async (req, res, next) => {
  try {
    const result = await AttendanceService.updateStudent(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const AttendanceController = {
  getClass,
  createNew,
  addDate,
  removeDate,
  updateClass,
  getStudentMonthAttendance,
  updateStudent
}