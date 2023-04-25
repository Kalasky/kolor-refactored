const { applyDiscordRole } = require('./discordUtils')
const Streamer = require('../models/Streamer')
const Reward = require('../models/Reward')

const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.login(process.env.DISCORD_TOKEN)

const extractDiscordNameTag = (userInput) => {
  const regex = /^([^#]+)#(\d{4})$/ // Discord name and tag format
  const match = userInput.trim().match(regex) // Extract name and tag from user input

  if (match) {
    return { name: match[1], tag: match[2] }
  } else {
    return null
  }
}

let foundUser

const findGuildMember = async (discordClient, discordGuildID, discordInfo) => {
  return new Promise(async (resolve, reject) => {
    // Find the Discord user in the guild
    try {
      const guild = discordClient.guilds.cache.get(discordGuildID)

      console.log('Looking for guild ID:', discordGuildID)
      console.log('Bot is in guilds with IDs:', discordClient.guilds.cache.map((g) => g.id).join(', '))

      if (!guild) {
        reject('Guild not found')
        return
      }

      const members = await guild.members.fetch() // Fetch all members in the guild

      // find the member in the guild
      const member = members.find(
        (member) => member.user.username === discordInfo.name && member.user.discriminator === discordInfo.tag
      )

      foundUser = `${member.user.username}#${member.user.discriminator}`

      if (member) {
        resolve(member)
        console.log(`Found member: ${foundUser}`)
      } else {
        reject('Member not found')
      }
    } catch (error) {
      reject(error.message)
    }
  })
}

// Fetch all members in a guild and log their username and discriminator
const fetchAndLogAllMembers = async (discordClient, discordGuildID) => {
  try {
    const guild = discordClient.guilds.cache.get(discordGuildID)

    if (!guild) {
      console.log('Guild not found')
      return
    }

    // Fetch all members in the guild
    const members = await guild.members.fetch()

    // Log each member's username and discriminator
    members.forEach((member) => {
      console.log(`${member.user.username}#${member.user.discriminator}`)
    })
  } catch (error) {
    console.error('Error fetching members:', error.message)
  }
}

const processedEvents = new Set()

const handleReward = async (rewardID, notification) => {
  // Channel reward redemption user input
  const userInput = notification.event.user_input
  // Extract the Discord name and tag from the user input
  const discordInfo = extractDiscordNameTag(userInput)
  // Find the reward in the database from rewardID parameter
  const reward = await Reward.findOne({ twitchRewardID: rewardID })
  const streamer = await Streamer.findOne({ twitchBroadcasterID: notification.event.broadcaster_user_id })
  // Get the Discord guild ID and streamer username from the database
  const discordGuildID = streamer.discordGuildID
  // fetchAndLogAllMembers(client, discordGuildID)

  try {
    const member = await findGuildMember(client, discordGuildID, discordInfo)

    if (processedEvents.has(notification.event.id)) {
      console.log('Event already processed:', notification.event.id)
      return
    }

    // Add the event ID to the Set of processed events
    processedEvents.add(notification.event.id)

    if (!discordInfo) {
      console.log('Invalid Discord name and tag provided:', userInput)
      return
    }

    if (!reward) {
      console.log('Unknown reward ID:', rewardID)
      return
    }

    let rewardField
    switch (reward.title) {
      case 'Very Slight Color':
        rewardField = 'customVerySlight'
        break
      case 'Slight Color':
        rewardField = 'customSlight'
        break
      case 'Full Color':
        rewardField = 'customFull'
        break
      default:
        console.log('Unknown reward ID:', rewardID)
        return
    }

    const rewardId = reward.twitchRewardID

    if (streamer) {
      // Pass the discordGuildID from the streamer to the applyDiscordRole function
      applyDiscordRole(
        rewardField,
        rewardId,
        discordInfo,
        streamer.discordGuildID,
        notification.event.id,
        notification.event.user_login,
        member
      )
    } else {
      console.log(`Streamer not found: ${notification.event.broadcaster_user_login}`)
    }
  } catch (error) {
    console.error(`Error processing reward: ${error}`)
  }
}

module.exports = {
  handleReward,
}
