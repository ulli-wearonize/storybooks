const mongoose = require('mongoose')

const NumberSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('Number', NumberSchema)
