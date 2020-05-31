import mongoose from 'mongoose'

const Country = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  population_updated: {
    type: Number,
  },
  population: {
    type: Number,
  },
  total: {
    type: Object,
  },
  new: {
    type: Object,
  },
})

export default mongoose.model('countries', Country)
