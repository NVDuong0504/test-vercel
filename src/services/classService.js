import { ObjectId } from 'mongodb'
import { classModel } from '../models/classModel'
import { StudentModel } from '../models/studentModel'
import { studentService } from './studentService'
import { enrollService } from './enrollService'
import { AttendanceService } from './attendanceService'
import { TuitionFeeService } from './tuitionFee'

const createNew= async(reqBody)=>{
  // eslint-disable-next-line no-useless-catch
  try {
    const newClass = {
      ...reqBody
    }

    const createdClass = await classModel.createNew(newClass)
    const getNewClass = await classModel.findOneById(createdClass.insertedId)
    return getNewClass
  } catch (error) {
    throw error
  }
}

const getAll = async ()=>{
  try {
    const result = await classModel.getAll()
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetail = async (id) => {
  try {
    const result = await classModel.findOneById(new ObjectId(id));
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (id) => {
  try {
    const record = await classModel.findOneById(new ObjectId(id))
    const enroll = await enrollService.getByClassId(id)
    const studentIds = enroll.studentIds;
    if (studentIds.length) {
      const studentIdsString = studentIds.map( item => item.toString())
      await studentService.deleteManyByIds(studentIdsString)
      await enrollService.deleteByStudentIds(studentIdsString)
      await AttendanceService.deleteByStudentIds(studentIdsString)
      await TuitionFeeService.deleteByStudentIds(studentIdsString)
    }
    await classModel.deleteOne(new ObjectId(id))
    return record
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, reqBody)=> {
  try {
    const result = classModel.updateOneById(id, reqBody)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteMany = async (classIds) => {
  try {
    const enrolls = await enrollService.getByClassIds(classIds)
    const studentIds = enrolls.map(enroll => enroll.studentId.toString())
    if (studentIds.length) {
      await TuitionFeeService.deleteByStudentIds(studentIds)
      await AttendanceService.deleteByStudentIds(studentIds)
      await studentService.deleteManyByIds(studentIds)
    }
    const result = await classModel.deleteManyByIds(classIds)

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const classService= {
  createNew,
  getDetail,
  deleteOne,
  getAll,
  updateOneById,
  deleteMany
}