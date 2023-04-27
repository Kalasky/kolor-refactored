const mongoose = require('mongoose')

const colorRoleSchema = new mongoose.Schema(
  {
    guildId: String,
    customVerySlight: [
      {
        color: String,
        roleId: String,
      },
    ],
    customSlight: [
      {
        color: String,
        roleId: String,
      },
    ],
    customFull: [
      {
        color: String,
        roleId: String,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('ColorRole', colorRoleSchema)
