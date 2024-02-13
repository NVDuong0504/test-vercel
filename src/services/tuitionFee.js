import { TuitionFeeModel } from '~/models/tuitionFeeModel'

const calcClassTuitionFee = async (data) => {
  try {
    const result = await TuitionFeeModel.getClassAttendanceByMonth(data)
    const finalResult = result.map((item) => {
      const count = item.dates.length
      const amountTuitionFee = count * item.class.tuitionFee
      const classId = item.class._id
      const studentId = item.student._id
      delete item._id
      delete item.class
      delete item.student
      return {
        classId,
        studentId,
        count,
        month: data.month,
        year: data.year,
        amountTuitionFee
      }
    })
    const insertResult = await TuitionFeeModel.writeClassTuitionFee(finalResult, data.classId, data.month, data.year)
    return insertResult
  } catch (error) {
    throw new Error(error)
  }
}

const getClassTuitionFeeDetail = async (req) => {
  try {
    const classId = req.params.id
    const month = req.query.m
    const year = req.query.y
    const result = await TuitionFeeModel.getClassTuitionFeeDetail({ classId, month:month, year:year })
    const totalRecord = result.length
    const totalPaid = result.reduce((prev, cur) => {
      if (cur.isPaid) return prev + 1
      return prev
    }, 0)
    return { count: { total: totalRecord, paid: totalPaid }, data: result}
  } catch (error) {
    throw new Error(error)
  }
}

const handlePaid = async (data) => {
  try {
    const result = await TuitionFeeModel.handlePaid(data.studentId, data.classId, data.month, data.year)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByStudentIds = async (ids) => {
  try {
    const result = await TuitionFeeModel.deleteByStudentIds(ids)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getTuitionFeeByStudentId = async (req) => {
  try {
    const studentId = req.params.id
    const monthStart = { month: req.query.monthStart, year: req.query.yearStart }
    const monthFinish = { month: req.query.monthFinish, year: req.query.yearFinish }
    const result = await TuitionFeeModel.getTuitionFeeByStudentId(studentId, monthStart, monthFinish)
    console.log(result)
    const dateStart = new Date(monthStart.year, monthStart.month - 1, 1)
    const dateFinish = new Date(monthFinish.year, monthFinish.month, 0)
    const paymentCount = { all:0, paid:0, notPaid:0 }
    const r = result.filter((tuitionFee) => {
      const date = new Date(tuitionFee.year, tuitionFee.month - 1, 1)
      const cond = (dateStart.getTime() <= date.getTime() && date.getTime() <= dateFinish.getTime())
      if (cond) {
        paymentCount.all+=1
        tuitionFee.isPaid?paymentCount.paid+=1:paymentCount.notPaid+=1
      }
      return cond
    })
    return { tuitionFees: r, paymentCount }
  } catch (error) {
    throw new Error(error)
  }
}

const getTuitionFeePaidByStudentId = async (req) => {
  const result = await getTuitionFeeByStudentId(req)
  const { tuitionFees, paymentCount } = result
  const paidResult = tuitionFees.filter(item => {
    return item.isPaid
  })
  return { tuitionFees:paidResult, paymentCount }
}

const getTuitionFeeNotPaidByStudentId = async (req) => {
  const result = await getTuitionFeeByStudentId(req)
  const { tuitionFees, paymentCount } = result
  const notPaidResult = tuitionFees.filter(item => {
    return !item.isPaid
  })
  return { tuitionFees: notPaidResult, paymentCount }
}

const updatePaidByIds = async (req) => {
  try {
    const ids = req.body.ids
    const result = await TuitionFeeModel.updatePaidByIds(ids)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const TuitionFeeService = {
  calcClassTuitionFee,
  getClassTuitionFeeDetail,
  handlePaid,
  deleteByStudentIds,
  getTuitionFeeByStudentId,
  getTuitionFeePaidByStudentId,
  getTuitionFeeNotPaidByStudentId,
  updatePaidByIds
}