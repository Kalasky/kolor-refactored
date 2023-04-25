const twitchClientSetup = require('./tmiSetup')
const twitchClient = twitchClientSetup.setupTwitchClient()
const { getUser, eventSubList, createEventSub, createReward, dumpEventSubs } = require('./twitchUtils')

// models
const Streamer = require('../models/Streamer')
const Reward = require('../models/Reward')

// token middleware
const { twitchHandler } = require('../middleware/twitchRefreshHandler')

const refreshMiddleware = async (broadcaster_user_id) => {
  await twitchHandler(broadcaster_user_id)
}

const createEventSubCommand = async () => {
  twitchClient.on('message', async (channel, tags, message, self) => {
    // grab the streamer username from the channel name
    const streamer_username = channel.slice(1)
    // find the streamer in the database
    const streamer = await Streamer.findOne({ twitchStreamername: streamer_username })
    // grab the broadcaster id from the streamer
    const broadcaster_id = streamer.twitchBroadcasterID
    // refresh the middleware
    await refreshMiddleware(broadcaster_id)

    // get all rewards for the broadcaster  and create eventsub subscriptions for each reward

    if (self) return
    const command = message.slice(1).split(' ')[0].toLowerCase()
    if (command === 'createeventsub' || (command === 'ces' && tags.username === streamer_username)) {
      // Fetch the rewards for the specific broadcaster from the database
      const rewards = await Reward.find({ twitchBroadcasterID: broadcaster_id })

      // Create event subscriptions for each reward
      rewards.forEach((reward) => {
        createEventSub(reward.twitchRewardID, broadcaster_id)
      })
    }
  })
}

// List of all active eventsub subscriptions
const eventSubListCommand = async () => {
  twitchClient.on('message', async (channel, tags, message, self) => {
    // grab the streamer username from the channel name
    const streamer_username = channel.slice(1)
    // find the streamer in the database
    const streamer = await Streamer.findOne({ twitchStreamername: streamer_username })
    // grab the broadcaster id from the streamer
    const broadcaster_id = streamer.twitchBroadcasterID
    // refresh the middleware
    await refreshMiddleware(broadcaster_id)

    if (self) return
    const command = message.slice(1).split(' ')[0].toLowerCase()
    if (command === 'eventsublist' || (command === 'esl' && tags.username === streamer_username)) {
      eventSubList()
    }
  })
}

// delete all webhook eventsub subscriptions
const dumpEventSubsCommand = async () => {
  twitchClient.on('message', async (channel, tags, message, self) => {
    // grab the streamer username from the channel name
    const streamer_username = channel.slice(1)
    // find the streamer in the database
    const streamer = await Streamer.findOne({ twitchStreamername: streamer_username })
    // grab the broadcaster id from the streamer
    const broadcaster_id = streamer.twitchBroadcasterID
    // refresh the middleware
    await refreshMiddleware(broadcaster_id)

    if (self) return
    const command = message.slice(1).split(' ')[0].toLowerCase()
    if (command === 'dumpeventsubs' || (command === 'des' && tags.username === streamer_username)) {
      dumpEventSubs(streamer_username)
    }
  })
}

// create default color rewards
const createColorRewards = async () => {
  twitchClient.on('message', async (channel, tags, message, self) => {
    // grab the streamer username from the channel name
    const streamer_username = channel.slice(1)
    // find the streamer in the database
    const streamer = await Streamer.findOne({ twitchStreamername: streamer_username })
    // grab the broadcaster id from the streamer
    const broadcaster_id = streamer.twitchBroadcasterID
    // refresh the middleware
    await refreshMiddleware(broadcaster_id)

    if (self) return
    const command = message.slice(1).split(' ')[0].toLowerCase()
    if (command === 'defaultrewards' || (command === 'dr' && tags.username === streamer_username)) {
      await createReward(
        'Very Slight Color', // title of the reward
        'Redeem a very slight color role in my discord server! Provide your Discord name and tag: Name#1234', // prompt of the reward
        500, // cost of the reward
        '#43C4EB', // color of the reward
        true, // global cooldown
        false, // is enabled
        0, // max per stream
        broadcaster_id,
        streamer.twitchAccessToken
      )
    }
  })
}

const getStreamerData = async () => {
  twitchClient.on('message', async (channel, tags, message, self) => {
    // grab the streamer username from the channel name
    const streamer_username = channel.slice(1)
    // find the streamer in the database
    const streamer = await Streamer.findOne({ twitchStreamername: streamer_username })
    // grab the broadcaster id from the streamer
    const broadcaster_id = streamer.twitchBroadcasterID
    // refresh the middleware
    await refreshMiddleware(broadcaster_id)

    if (self) return
    const args = message.slice(1).split(' ')
    const command = args.shift().toLowerCase()

    if (command === 'me' && tags.username === streamer_username) {
      getUser(streamer_username, streamer.twitchAccessToken)
    }
  })
}

module.exports = {
  createColorRewards,
  createEventSubCommand,
  dumpEventSubsCommand,
  eventSubListCommand,
  getStreamerData,
}
