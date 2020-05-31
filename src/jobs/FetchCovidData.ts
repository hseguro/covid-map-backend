import Bull from 'bull'
import Axios from 'axios'
import Country from '../models/Country'
import CovidGlobal from '../models/CovidGlobal'

const REDIS_HOST = process.env['REDIS_HOST'] || 'localhost'
const REDIS_PORT = parseInt(process.env['REDIS_PORT']) || 6379

const FetchCovidDataJob = new Bull('fetch-covid-data', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
})

async function FetchCovidDataProcess(job: Bull.Job<any>) {
  try {
    let countries = await Country.find()
    let result = (await Axios.get('https://api.covid19api.com/summary')).data

    let global_data = await CovidGlobal.findOne({})

    if (global_data === undefined || global_data === null) {
      global_data = new CovidGlobal({
        total: {
          confirmed: result.Global.TotalConfirmed,
          recovered: result.Global.TotalRecovered,
          deaths: result.Global.TotalDeaths,
        },
        new: {
          confirmed: result.Global.NewConfirmed,
          recovered: result.Global.NewRecovered,
          deaths: result.Global.NewDeaths,
        },
      })

      await global_data.save()
    } else {
      // @ts-ignore
      global_data.total = {
        confirmed: result.Global.TotalConfirmed,
          recovered: result.Global.TotalRecovered,
          deaths: result.Global.TotalDeaths,
      }
      // @ts-ignore
      global_data.new = {
        confirmed: result.Global.NewConfirmed,
          recovered: result.Global.NewRecovered,
          deaths: result.Global.NewDeaths,
      }

      await global_data.update(global_data)
    }

    for await (let country_data of result.Countries) {
      let country: any = countries.find((country: any) => country.slug == country_data.CountryCode)

      if (country !== undefined && country !== null) {
        country.name = country_data.Country
        country.new = {
          confirmed: country_data.NewConfirmed,
          recovered: country_data.NewRecovered,
          deaths: country_data.NewDeaths,
        }

        country.total = {
          confirmed: country_data.TotalConfirmed,
          recovered: country_data.TotalRecovered,
          deaths: country_data.TotalDeaths,
        }

        await country.update(country)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export default FetchCovidDataJob

export {
    FetchCovidDataProcess,
}
