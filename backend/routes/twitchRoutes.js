const express = require('express')
const router = express.Router()
const Streamer = require('../models/Streamer')
const qs = require('qs')

router.get('/twitch/login', async (req, res) => {
  const scope = 'channel:manage:redemptions channel:read:redemptions channel:manage:vips chat:edit chat:read'

  res.redirect(
    307,
    'https://id.twitch.tv/oauth2/authorize?' +
      qs.stringify({
        response_type: 'code',
        client_id: process.env.TWITCH_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.TWITCH_REDIRECT_URI,
      })
  )
})

let accessToken
let refreshToken

router.get('/twitch/callback', async (req, res) => {
  // Get the authorization code from the query parameters
  const code = req.query.code
  const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.TWITCH_REDIRECT_URI,
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (tokenData.error) {
    return res.status(401).json({ error: 'Failed to authenticate with Twitch' })
  }

  accessToken = tokenData.access_token
  refreshToken = tokenData.refresh_token

  // Get the broadcaster ID and username using the access token
  const userResponse = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const userData = await userResponse.json()
  const broadcasterId = userData.data[0].id
  const broadcasterUsername = userData.data[0].login

  // Find user by their Twitch username or Spotify username
  const user = await Streamer.findOne({
    twitchStreamername: broadcasterUsername,
  })

  if (user) {
    Streamer.findOneAndUpdate(
      { twitchBroadcasterID: broadcasterId },
      {
        twitchAccessToken: accessToken,
        twitchRefreshToken: refreshToken,
        twitchBroadcasterID: broadcasterId,
      },
      { new: true } // Return updated document
    )
      .then((doc) => {
        console.log('Streamer successfully updated', doc)
      })
      .catch((err) => {
        console.log('Something wrong when updating data!', err)
      })

    res.status(200).json({ success: true })
  } else {
    // If user is not in the database, create a new user
    const newUser = new Streamer({
      twitchStreamername: broadcasterUsername,
      twitchAccessToken: accessToken,
      twitchRefreshToken: refreshToken,
      twitchBroadcasterID: broadcasterId,
      discordGuildID: 'TBD',
    })
    await newUser.save()
    res.status(200).json({ success: true })
  }
})

module.exports = router
