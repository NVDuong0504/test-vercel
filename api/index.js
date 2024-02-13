import express from 'express'
// import cors from 'cors'
// import env from '~/config/environment'

import { CONNECT_DB } from '~/config/mongodb'
// import { APIs_V1 } from '~/routes/v1'
// import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER= () => {
  const app = express()
  // app.use(express.json())
  // app.use(cors())

  // app.use('/v1', APIs_V1)
  app.get('/api',(req, res)=>{
    res.json({message: 13})
  })

  //middleware xử lý lỗi tập trung
  // app.use(errorHandlingMiddleware)
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
  })
}


CONNECT_DB()
  .then(() => {console.log('2. Connected to mongodb')})
  .then(() => {START_SERVER()})
  .catch(error => {
    console.log(error)
    process.exit()
  })
