const { Client, GatewayIntentBits } = require('discord.js')

const { getTwitchClient } = require('./tmiSetup')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.login(process.env.DISCORD_TOKEN)

// models
const ColorRole = require('../models/ColorRole')
const UserColor = require('../models/UserColor')
const Streamer = require('../models/Streamer')
const Reward = require('../models/Reward')

// twitch utils
const { cancelTwitchReward } = require('./twitchUtils')

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

const updateUserColorRoles = async (rewardField, userId, roleId) => {
  try {
    // This updates the rewardField value to match UserColor schema field names
    const fieldMapping = {
      customVerySlight: 'verySlightColors',
      customSlight: 'slightColors',
      customFull: 'fullColors',
    }

    // Update the rewardField value to match UserColor schema field names
    const updatedRewardField = fieldMapping[rewardField]

    let userColor = await UserColor.findOne({ discordId: userId })

    if (!userColor) {
      // Create a new userColor document if it doesn't exist
      userColor = new UserColor({
        discordId: userId,
        [updatedRewardField]: [roleId],
      })
    } else {
      // Add the new role to the existing userColor document
      userColor[updatedRewardField].push(roleId)
    }

    await userColor.save()
    console.log(`User color roles updated for user ID: ${userId}`)
  } catch (error) {
    console.error(`Error updating user color roles: ${error.message}`)
  }
}

const applyDiscordRole = async (rewardField, rewardId, discordInfo, discordGuildID, notification, redeemerUsername, member) => {
  const guild = client.guilds.cache.get(discordGuildID)

  // Find the Discord user in the guild
  const user = member
  console.log('user:', user)

  // Streamer info
  const broadcasterId = await Reward.findOne({ twitchRewardID: rewardId })
  const streamer = await Streamer.findOne({ twitchBroadcasterID: broadcasterId.twitchBroadcasterID })
  const twitchClient = await getTwitchClient(streamer.twitchStreamername)

  if (!user) {
    // User not found in the Discord server, cancel the Twitch reward and inform the user in Twitch chat
    const redemptionId = notification

    await cancelTwitchReward(broadcasterId.twitchBroadcasterID, rewardId, redemptionId, streamer.twitchAccessToken)

    // Send a message in Twitch chat to inform the user that the reward has been refunded
    sendMessage(
      twitchClient,
      streamer.twitchStreamername,
      `@${redeemerUsername}, your reward has been refunded as you are not in the Discord server.`
    )

    return
  }

  // Find the color roles for the guild
  const guildColorRoles = await ColorRole.findOne({ guildId: discordGuildID })

  if (guildColorRoles && guildColorRoles[rewardField]) {
    // Filter out the roles that the user already has
    const availableRoles = guildColorRoles[rewardField].filter((roleInfo) => !user.roles.cache.has(roleInfo.roleId))

    if (availableRoles.length > 0) {
      // Select a random role from the available roles
      const randomIndex = Math.floor(Math.random() * availableRoles.length)
      const selectedRole = availableRoles[randomIndex]

      // Apply the role to the user in Discord
      await user.roles.add(selectedRole.roleId)
      console.log(`Role ${selectedRole.roleId} added to user ${user.user.username}#${user.user.discriminator}`)
      sendMessage(
        twitchClient,
        streamer.twitchStreamername,
        `@${redeemerUsername}, you have been given a very slight color role in the streamer\'s Discord server.`
      )

      // Update the user's color roles in the database
      await updateUserColorRoles(rewardField, user.id, selectedRole.roleId)
    } else {
      console.log(`No available color roles for user ${user.user.username}#${user.user.discriminator}`)

      const twitchClient = await getTwitchClient(streamer.twitchStreamername)
      sendMessage(
        twitchClient,
        streamer.twitchStreamername,
        `@${redeemerUsername}, you have reached the maximum number of very slight color roles. In the streamer's Discord server, run the command /trade-very-slight to trade all of your very slight color roles for a slight color role.`
      )
    }
  } else {
    console.log(`Color roles not found for guild ID: ${discordGuildID}`)
  }
}

module.exports = { applyDiscordRole }
