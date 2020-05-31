import Bull from 'bull'
import path from 'path'
import fs from 'fs'
import Axios from 'axios'
import Country from '../models/Country'
import { Document } from 'mongoose'

const REDIS_HOST = process.env['REDIS_HOST'] || 'localhost'
const REDIS_PORT = parseInt(process.env['REDIS_PORT']) || 6379

const ParseCSVJob = new Bull('parse-csv', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
})

async function ParseCSVProcess(job: Bull.Job<any>) {
  await Country.deleteMany({})
  
  const countries = fs.readFileSync('./countries.csv').toString().split('\n').map((line) => line.split(';')).map(([slug, lat, lon]) => ({ slug, lat, lon }))
  const codes = fs.readFileSync('./codes.csv').toString().split('\n').map((line) => line.split(';')).map(([first, second]) => ({ first, second }))
  let populations = fs.readFileSync('./population.csv').toString().split('\r\n').map((line) => line.split(',').reverse().splice(0, 3)).map(([pop, year, slug ]) => ({ slug, year: parseInt(year), pop: parseInt(pop) }))

  try {
    populations = populations.map((population) => {
      let code = codes.find((code) => code.second === population.slug)

      return {
        ...population,
        slug: (code === null || code === undefined) ? population.slug : code.first,
      }
    })
  } catch (error) {
    console.error(error)
  }

  let countries_and_population = countries.map((country) => {
    return {
      ...country,
      population: populations.filter(pop => pop.slug == country.slug).sort((a, b) => a.year - b.year).pop(),
    }
  })

  for await (let _country of countries_and_population) {
    let country = new Country({
      slug: _country.slug,
      latitude: _country.lat,
      longitude: _country.lon,
      population_updated: (_country.population !== null && _country.population !== undefined) ? _country.population.year : null,
      population: (_country.population !== null && _country.population !== undefined) ? _country.population.pop : null,
    })

    await country.save()
  }
}

export default ParseCSVJob

export {
  ParseCSVProcess,
}
