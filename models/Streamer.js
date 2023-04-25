const mongoose = require('mongoose')

// create a schema for a spotify user
const StreamerSchema = new mongoose.Schema(
  {
    twitchBroadcasterID: { type: String, required: true },
    twitchStreamername: { type: String, required: true },
    twitchAccessToken: { type: String, required: true },
    twitchRefreshToken: { type: String, required: true },
    discordGuildID: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Streamer', StreamerSchema)
