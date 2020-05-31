import init from './init'
import FetchCovidDataJob, { FetchCovidDataProcess } from './jobs/FetchCovidData'
import ParseCSVJob, { ParseCSVProcess } from './jobs/ParseCSV'

init(() => {
  FetchCovidDataJob.process(FetchCovidDataProcess)
  ParseCSVJob.process(ParseCSVProcess)
}, (error) => {
  console.log(error)
  process.exit(1)
})
