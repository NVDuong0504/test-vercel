import { AttendanceModel } from '../models/attendanceModel'

const getClass = async ( data ) => {
  try {
    const result = await AttendanceModel.getClass(data)
    return result.map(item => item.studentId)
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async(data) => {
  try {
    const result = await AttendanceModel.createNew(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addDate = async (data) => {
  try {
    const result = await AttendanceModel.addDate(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeDate = async (data) => {
  try {
    const result = AttendanceModel.removeDate(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateStudent = async (data) => {
  try {
    const datesAdd = data.datesAdd
    const datesRemove = data.datesRemove
    delete data.datesAdd
    delete data.datesRemove
    const addData = { ...data, dates: datesAdd }
    const removeData = { ...data, dates: datesRemove }
    const addResult = await AttendanceModel.addDate(addData)
    const removeResult = await AttendanceModel.removeDate(removeData)
    const result = { addResult, removeResult }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateClass = async (data) => {
  try {
    const result = await AttendanceModel.updateClass(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getStudentMonthAttendance = async (studentId, classId, month, year) => {
  try {
    const data = {
      studentId, classId, month, year
    }
    const result = await AttendanceModel.getStudentMonthAttendance(data)
    if (result != null)
      result.count = result.monthAttendances.length
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  try {
    const result = AttendanceModel.deleteByStudentIds(ids)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const AttendanceService = {
  getClass,
  createNew,
  addDate,
  removeDate,
  updateClass,
  getStudentMonthAttendance,
  updateStudent,
  deleteByStudentIds
}