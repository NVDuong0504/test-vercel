import { ObjectId } from 'mongodb'
import { EnrollModel } from '~/models/enrollModel'

const createNew = async (data) => {
  try {
    data.classId = new ObjectId(data.classId)
    data.studentId = new ObjectId(data.studentId)
    const result = await EnrollModel.createNew(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (data) => {
  try {
    const result = { message: 'deleteOne from service', data }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async() => {
  try {
    const enrolls = await EnrollModel.getAll()
    const students = enrolls.map((enroll)=>{
      const newEnrollItem = {
        classInfor: enroll.classInfor?enroll.classInfor[0]:null,
        studentDetail: enroll.studentDetail?enroll.studentDetail[0]:[]
      }
      return newEnrollItem
    })

    const studentFilter = students.filter((item)=>{
      return item.studentDetail
    })
    return studentFilter
  } catch (error) {
    throw new Error(error)
  }

}

const getByClassId = async (classId) => {
  try {
    const id = new ObjectId(classId)
    const result = await EnrollModel.getByClassId(id)
    const studentIds = result.map(( item ) => { return item.studentId })
    return { classId, studentIds }
  } catch (error) {
    throw new Error(error)
  }
}

const getByClassIds = async (classIds) => {
  try {
    const result = await EnrollModel.getByClassIds(classIds)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getClassDetail = async (classId) => {
  try {
    const id = new ObjectId(classId)
    const enrolls = await EnrollModel.getClassDetail(id)
    const students = enrolls.map((enroll)=>{
      return { classInfor : enroll.classInfor[0], studentInfor: enroll.studentDetail[0] }
    })
    return students.filter( item => {
      return item.studentInfor
    })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  try {
    const result = EnrollModel.deleteByStudentIds(ids)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const enrollService ={
  getAll,
  createNew,
  deleteOne,
  getByClassId,
  getByClassIds,
  getClassDetail,
  deleteByStudentIds
}