import express from 'express'
import cors from 'cors'
import { json, urlencoded} from 'body-parser'
import mongoose from 'mongoose'
import init from './init'
import FetchCovidDataJob, { FetchCovidDataProcess } from './jobs/FetchCovidData'
import ParseCSVJob, { ParseCSVProcess } from './jobs/ParseCSV'
import Country from './models/Country'
import CovidGlobal from './models/CovidGlobal'

const CRON = process.env['CRON'] || '30 * * * *'

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  try {
    let global_data = await CovidGlobal.findOne().select('-_id -new._id -total._id')
    let countries = await Country.find().select('-_id -new._id -total._id')

    return res.json({
      messages: [
        "https://github.com/hseguro",
        "not all the countries have population, 'total' or 'new'",
      ],
      global: global_data,
      countries,
    })
  } catch (e) {
    return res.status(500).json({
      error: 'error loading data',
    })
  }
})

function startServerAndJobs() {
  app.listen(4000)

  FetchCovidDataJob.process(FetchCovidDataProcess)
  ParseCSVJob.process(ParseCSVProcess)

  FetchCovidDataJob.getJobCounts().then(result => {
    if (result.delayed == 0) {
      FetchCovidDataJob.add({}, {
        repeat: {
          cron: CRON,
        },
      })
    }
  })
}

init(() => {
  startServerAndJobs()
}, (error) => {
  console.error(error)
  process.exit(1)
})