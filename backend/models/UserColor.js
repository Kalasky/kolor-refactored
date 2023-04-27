const mongoose = require('mongoose')

const userColorSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    verySlightColors: {
      type: [String],
      default: [],
    },
    slightColors: {
      type: [String],
      default: [],
    },
    fullColors: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserColor', userColorSchema)
