// models/Reward.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rewardSchema = new Schema(
  {
    title: { type: String, required: true },
    twitchRewardID: { type: String, required: true },
    twitchBroadcasterID: { type: String, required: true },
  },
  { timestamps: true }
)

const Reward = mongoose.model('Reward', rewardSchema)

module.exports = Reward
