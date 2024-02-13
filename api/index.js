import express from 'express'
import cors from 'cors'
import env from './config/environment'

import { CONNECT_DB, GET_DB } from './config/mongodb'
import { APIs_V1 } from './routes/v1'
import { StatusCodes } from 'http-status-codes'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER= () => {
  const app = express()
  app.use(express.json())
  app.use(cors())

  app.use('/v1', APIs_V1)

  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hello ${env.AUTHOR}, I am running at ${ env.APP_PORT }:${  env.APP_HOST }`)
  })
}

console.log('1. Connecting to mongodb')
CONNECT_DB()
  .then(() => {console.log('2. Connected to mongodb')})
  .then(() => {START_SERVER()})
  .catch(error => {
    console.log(error)
    process.exit()
  })
