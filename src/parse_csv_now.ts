import ParseCSVJob from './jobs/ParseCSV'

ParseCSVJob.add({}).then(() => {
  process.exit(0)
}).catch((error) => {
  console.error(error)
  process.exit(1)
})