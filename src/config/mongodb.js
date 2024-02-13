import { MongoClient, ServerApiVersion } from 'mongodb'
import env from './environment'

let databaseInstance =null
const clientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})


export const CONNECT_DB = async () => {
  await clientInstance.connect()
  databaseInstance = clientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!databaseInstance) throw new Error('Must connect to db first')
  return databaseInstance
}

