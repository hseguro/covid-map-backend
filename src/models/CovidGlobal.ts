import mongoose from 'mongoose'

const CovidGlobal = new mongoose.Schema({
  total: {
    type: Object,
  },
  new: {
    type: Object,
  },
})

export default mongoose.model('covid_global', CovidGlobal)
