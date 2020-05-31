import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const MONGO_HOST = process.env['MONGO_HOST'] || 'localhost'
const MONGO_PORT = process.env['MONGO_PORT'] || '27017'
const MONGO_USER = process.env['MONGO_USER'] || 'covid_map'
const MONGO_PASSWORD = process.env['MONGO_PASSWORD'] || 'covid_map_password'
const MONGO_DB = process.env['MONGO_DB'] || 'covid_map'

export default (done, fail) => {
  mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}`, {
    dbName: MONGO_DB,
    user: MONGO_USER,
    pass: MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    done()
  }).catch(error => {
    fail(error)
  })
}
