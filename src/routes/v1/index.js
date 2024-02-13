import express from 'express'

import { classRoutes } from './classRoutes'
import { StudentRoutes } from './studentRoutes'
import { EnrollRoutes } from './enrollRoutes'
import { AttendanceRouters } from './attendanceRoutes'
import { TuitionFeeRoutes } from './tuitionFeeRoutes'
const Router = express.Router()

Router.use('/class', classRoutes)
Router.use('/student', StudentRoutes)
Router.use('/enroll', EnrollRoutes)
Router.use('/attendance', AttendanceRouters)
Router.use('/tuitionFee', TuitionFeeRoutes)

export const APIs_V1 = Router