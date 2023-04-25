// timisetup.js
const tmi = require('tmi.js')

/*
  By using a map to store twitchClient instances, the bot can efficiently manage
  multiple streamers and their associated clients. This approach ensures that
  each streamer has a unique client instance, preventing conflicts and enabling
  the bot to operate properly for every streamer.
*/
const clients = new Map()

const setupTwitchClient = (streamer_username) => {
  if (!clients.has(streamer_username)) {
    const twitchClient = new tmi.Client({
      options: { debug: true },
      channels: [streamer_username],
      connection: { reconnect: true },
      identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_TOKEN,
      },
    })
    twitchClient.connect()

    clients.set(streamer_username, twitchClient)
  }
  return clients.get(streamer_username)
}

module.exports = {
  setupTwitchClient,
}
