const tmi = require('tmi.js')
const Streamer = require('../models/Streamer')
// get the streamer name from the database

let twitchClient = null

const setupTwitchClient = () => {
  if (!twitchClient) {
    twitchClient = new tmi.Client({
      options: { debug: true },
      channels: ['kalaskyyy'],
      connection: { reconnect: true },
      identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_TOKEN,
      },
    })
    twitchClient.connect()
  }
  return twitchClient
}

module.exports = {
  setupTwitchClient,
}
