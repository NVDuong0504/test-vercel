import { ObjectId } from 'mongodb'
import { AttendanceModel } from '../models/attendanceModel';
import { EnrollModel } from '../models/enrollModel';
import { StudentModel } from '../models/studentModel'
import { TuitionFeeModel } from '../models/tuitionFeeModel';
import { enrollService } from '../services/enrollService'
import { AttendanceService } from '../services/attendanceService';
import { TuitionFeeService } from '../services/tuitionFee';

const createNew = async (reqBody) => {
  try {
    const classId = new ObjectId(reqBody.classId);
    const newStudent = { ...reqBody }
    delete newStudent.classId

    const createdStudent = await StudentModel.createNew(newStudent)
    const studentId = createdStudent.insertedId
    await EnrollModel.createNew({ classId, studentId })
    await AttendanceModel.createNew({ classId: classId.toString(), studentId: studentId.toString()})
    const getNewStudent = await StudentModel.findOneById(createdStudent.insertedId)
    return getNewStudent
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await StudentModel.findOneById(new ObjectId(id))
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await StudentModel.getAll()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    const record = await findOneById(id)
    await StudentModel.deleteOneById(id)
    await EnrollModel.deleteByStudentId(id)
    await AttendanceModel.deleteByStudentId(id)
    await TuitionFeeModel.deleteByStudentId(id)
    return record
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (studentId, data) => {
  try {
    const classId = data.classId
    delete data.classId
    await StudentModel.updateOneById( studentId, data)
    if (classId) {
      await EnrollModel.updateStudentErroll( studentId.toString(), classId.toString())
      await AttendanceModel.updateClassOfStudent(studentId, classId)
    }
    const studentUpdated = await findOneById(studentId)
    return studentUpdated
  } catch (error) {
    throw new Error(error)
  }

}

const deleteManyByIds = async (ids) => {
  try {
    await enrollService.deleteByStudentIds(ids)
    await AttendanceService.deleteByStudentIds(ids)
    await TuitionFeeService.deleteByStudentIds(ids)
    const result = await StudentModel.deleteManyByIds(ids)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const studentService = {
  createNew,
  findOneById,
  getAll,
  deleteOneById,
  updateOneById,
  deleteManyByIds
}
