// Description: This file contains all the functions that are used to interact with the Twitch API
const { getTwitchClient } = require('./tmiSetup')

// models
const Streamer = require('../models/Streamer')
const Reward = require('../models/Reward')

// Helper function that takes care of waiting for the Twitch client to be ready before sending a message
const sendMessage = async (twitchClient, streamer_username, message) => {
  if (twitchClient.readyState() === 'OPEN') {
    try {
      twitchClient.say(streamer_username, message)
    } catch (error) {
      console.error(error)
    }
  } else {
    twitchClient.once('connected', () => {
      try {
        twitchClient.say(streamer_username, message)
      } catch (error) {
        console.error(error)
      }
    })
  }
}

// get streamer user data
const getUser = async (streamer_username, access_token) => {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/users?login=${streamer_username}`, {
      method: 'GET',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

// list all webhook eventsub subscriptions
const eventSubList = async () => {
  const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions?status=enabled', {
    method: 'GET',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.APP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  console.log(data)
}

// create a webhook eventsub subscription for a specific channel reward
const createEventSub = async (reward_id, broadcaster_id, streamer_username) => {
  const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.APP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: {
        broadcaster_user_id: broadcaster_id,
        reward_id: reward_id,
      },
      transport: {
        method: 'webhook',
        callback: process.env.WEBHOOK_URL + '/events/twitch/eventsub',
        secret: process.env.TWITCH_WEBHOOK_SECRET,
      },
    }),
  })

  const twitchClient = await getTwitchClient(streamer_username)

  sendMessage(twitchClient, streamer_username, 'EventSub created!')

  const data = await res.json()
  console.log(data.data)
}

// create a new channel reward
const createReward = async (
  title,
  prompt,
  cost,
  background_color,
  is_user_input_required,
  is_global_cooldown_enabled,
  global_cooldown_seconds,
  broadcaster_id,
  access_token,
  streamer_username
) => {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        prompt: prompt,
        cost: cost,
        is_enabled: true,
        background_color: background_color,
        is_user_input_required: is_user_input_required,
        is_global_cooldown_enabled: is_global_cooldown_enabled,
        global_cooldown_seconds: global_cooldown_seconds,
      }),
    })
    const data = await res.json()
    console.log('Reward Name:', data.data[0].title, 'Reward ID:', data.data[0].id)

    const twitchClient = await getTwitchClient(streamer_username)

    sendMessage(twitchClient, streamer_username, 'Reward created!')

    // Save the reward id's in the database
    await Reward.findOneAndUpdate(
      {
        title: data.data[0].title,
        twitchBroadcasterID: broadcaster_id,
      },
      {
        twitchRewardID: data.data[0].id,
      },
      {
        upsert: true,
      }
    )
  } catch (error) {
    console.error(error)
  }
}

// delete a webhook eventsub subscription for a specific channel reward
const deleteEventSub = async (subscription_id) => {
  const res = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscription_id}`, {
    method: 'DELETE',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.APP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  return res
}

// delete all webhook eventsub subscriptions
// this function must be executed after every stream
const dumpEventSubs = async (streamer_username) => {
  const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions?status=enabled', {
    method: 'GET',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.APP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  const twitchClient = await getTwitchClient(streamer_username)

  // Check if there are any events to delete
  if (data.data.length > 0) {
    for (let i = 0; i < data.data.length; i++) {
      console.log('Unsubbed to:', data.data[i].id)
      await deleteEventSub(data.data[i].id)
    }
    await sendMessage(twitchClient, streamer_username, 'Deleted all eventsub subscriptions')
  } else {
    console.log('No eventsub subscriptions to delete')
    await sendMessage(twitchClient, streamer_username, 'No eventsub subscriptions to delete')
  }
}

// fulfill twitch channel reward from the redemption queue
const fulfillTwitchReward = async (clientId, broadcaster_id, reward_id, id) => {
  const user = await Streamer.findOne({ twitchStreamername: process.env.TWITCH_USERNAME })
  try {
    const res = await fetch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcaster_id}&reward_id=${reward_id}&id=${id}`,
      {
        method: 'PATCH',
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${user.twitchAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'FULFILLED',
        }),
      }
    )
    return res
  } catch (error) {
    console.log(error)
  }
}

// Cancel twitch channel reward from the redemption queue
const cancelTwitchReward = async (broadcaster_id, reward_id, id, access_token) => {
  try {
    const res = await fetch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcaster_id}&reward_id=${reward_id}&id=${id}`,
      {
        method: 'PATCH',
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELED',
        }),
      }
    )
    return res
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUser,
  eventSubList,
  createEventSub,
  createReward,
  deleteEventSub,
  dumpEventSubs,
  fulfillTwitchReward,
  cancelTwitchReward,
}
