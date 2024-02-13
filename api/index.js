import express from 'express'
import cors from 'cors'
import env from '../src/config/environment.js'

import { CONNECT_DB} from '../src/config/mongodb'
import { APIs_V1 } from '../src/routes/v1'
import { errorHandlingMiddleware } from '../src/middlewares/errorHandlingMiddleware.js'

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
