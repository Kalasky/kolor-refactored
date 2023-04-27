// tmisetup.js
const tmi = require('tmi.js')

/*
  By using a map to store twitchClient instances, the bot can efficiently manage
  multiple streamers and their associated clients. This approach ensures that
  each streamer has a unique client instance, preventing conflicts and enabling
  the bot to operate properly for every streamer.
*/
const clients = new Map()

const getClientOptions = (streamer_username) => {
  return {
    options: { debug: true },
    channels: [streamer_username],
    connection: { reconnect: true, reconnectInterval: 1000 },
    identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_BOT_TOKEN,
    },
  }
}

const getTwitchClient = (streamer_username) => {
  if (!clients.has(streamer_username)) {
    setupTwitchClient(streamer_username)
  }
  return clients.get(streamer_username)
}

const setupTwitchClient = (streamer_username) => {
  if (!clients.has(streamer_username)) {
    const options = getClientOptions(streamer_username)
    const twitchClient = new tmi.Client(options)
    twitchClient.connect().catch((error) => {
      console.error(`Error connecting to Twitch for ${streamer_username}:`, error)
    })
    
    clients.set(streamer_username, twitchClient)
  }
  return clients.get(streamer_username)
}

module.exports = {
  setupTwitchClient,
  clients,
  getTwitchClient,
  getClientOptions,
}
