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
})

module.exports = mongoose.model('Number', NumberSchema)
