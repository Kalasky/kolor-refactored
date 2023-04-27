const { getUser, eventSubList, createEventSub, createReward, dumpEventSubs } = require('./twitchUtils')

// models
const Streamer = require('../models/Streamer')
const Reward = require('../models/Reward')

// token middleware
const { twitchHandler } = require('../middleware/twitchRefreshHandler')

const refreshMiddleware = async (broadcaster_user_id) => {
  await twitchHandler(broadcaster_user_id)
}

// handle all twitch commands. This function is then exported to index.js to be used in the client.on('message') event
const handleMessage = async (channel, tags, message, self) => {
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
  switch (command) {
    case 'createeventsub':
    case 'ces':
      if (tags.username === streamer_username) {
        // Fetch the rewards for the specific broadcaster from the database
        const rewards = await Reward.find({ twitchBroadcasterID: broadcaster_id })

        // Create event subscriptions for each reward
        rewards.forEach((reward) => {
          createEventSub(reward.twitchRewardID, broadcaster_id, streamer_username)
        })
      }
      break

    case 'eventsublist':
    case 'esl':
      if (tags.username === streamer_username) {
        eventSubList()
      }
      break

    case 'dumpeventsubs':
    case 'des':
      if (tags.username === streamer_username) {
        dumpEventSubs(streamer_username)
      }
      break

    case 'defaultrewards':
    case 'dr':
      if (tags.username === streamer_username) {
        await createReward(
          'Very Slight Color', // title of the reward
          'Redeem a very slight color role in my discord server! Provide your Discord name and tag: Name#1234', // prompt of the reward
          500, // cost of the reward
          '#43C4EB', // color of the reward
          true, // global cooldown
          false, // is enabled
          0, // max per stream
          broadcaster_id,
          streamer.twitchAccessToken,
          streamer_username
        )
      }
      break

    case 'me':
      if (tags.username === streamer_username) {
        getUser(streamer_username, streamer.twitchAccessToken)
      }
      break
  }
}

module.exports = {
  handleMessage,
}
