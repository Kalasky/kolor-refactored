require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const deployCommands = require('./deploy-commands')
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js')
const { setupTwitchClient } = require('./utils/tmiSetup')

// models
const ColorRole = require('./models/ColorRole.js')
const UserColor = require('./models/UserColor.js')
const Streamer = require('./models/Streamer.js')

// database
const mongoose = require('mongoose')

// express
const express = require('express')
const app = express()
const PORT = process.env.PORT || 7777

// middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.raw({ type: 'application/json' }))

// routes
const twitchRoutes = require('./routes/twitchRoutes')
const eventSubRoutes = require('./routes/eventSubRoutes')

app.use('/api', twitchRoutes)
app.use('/events', eventSubRoutes)

app.get('/', (req, res) => {
  res.send('Access token and refresh token successfully refreshed! You can close this window now.')
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

async function removeColorRole(interaction, colorArrayName) {
  const [color, roleId] = interaction.values[0].split('-')
  const colorToRemove = `#${color}`

  // Remove the role from the Discord server
  const roleToRemove = interaction.guild.roles.cache.get(roleId)
  if (roleToRemove) {
    await roleToRemove.delete()
  }

  // Remove the color from the DB
  const guildId = interaction.guild.id
  const colorRole = await ColorRole.findOne({ guildId })

  if (colorRole) {
    const updateResult = await ColorRole.findOneAndUpdate(
      // find the document with the guildId and roleId
      { guildId, [`${colorArrayName}.roleId`]: roleId },
      // $pull removes the object from the array that matches the query
      { $pull: { [colorArrayName]: { roleId: roleId } } },
      // return the updated document
      { new: true }
    )

    // if the document was not updated, log an error
    if (updateResult !== null) {
      console.log('Error: Could not update the color role document.')
    }
  }

  // Send a confirmation message
  await interaction.reply({
    content: `The ${colorToRemove} role has been removed.`,
    ephemeral: true,
  })
}

async function handleSelectMenu(interaction, removeCategory, addCategory) {
  const guildId = interaction.guild.id
  const userId = interaction.user.id
  const selectedRoleId = interaction.values[0]

  const colorRole = await ColorRole.findOne({ guildId })
  const userColor = await UserColor.findOne({ discordId: userId })

  if (!colorRole || !userColor) {
    return interaction.reply('An error occurred. Please try again later.')
  }

  const member = interaction.guild.members.cache.get(userId)
  console.log(`Removing roles from the user: ${userId}`) // Log statement

  // Remove all roles from the user in the removeCategory
  for (const roleId of userColor[removeCategory]) {
    console.log(`Removing role: ${roleId}`) // Log statement
    await member.roles.remove(roleId)
  }

  // Remove roles from the userColor object
  userColor[removeCategory] = []

  console.log(`Finished removing roles for user: ${userId}`) // Log statement

  // Add the selected role from the addCategory to the user
  await member.roles.add(selectedRoleId)
  userColor[addCategory].push(selectedRoleId)

  await userColor.save()

  interaction.reply(`You have successfully traded your ${removeCategory} roles for the selected ${addCategory} role.`)
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    client.user.setUsername(process.env.BOT_NAME)

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  } else if (interaction.isStringSelectMenu()) {
    console.log('String select menu interaction detected.')
    if (interaction.customId === 'remove-slight-color') {
      await removeColorRole(interaction, 'remove-slight-color', 'customSlight')
    } else if (interaction.customId === 'remove-full-color') {
      await removeColorRole(interaction, 'remove-full-color', 'customFull')
    } else if (interaction.customId === 'remove-very-slight-color') {
      await removeColorRole(interaction, 'remove-very-slight-color', 'customVerySlight')
    } else if (interaction.customId === 'trade-customVerySlight-to-customSlight') {
      console.log('Trade customVerySlight to customSlight detected.')
      await handleSelectMenu(interaction, 'verySlightColors', 'slightColors')
    } else if (interaction.customId === 'trade-customSlight-to-customFull') {
      console.log('Trade customSlight to customFull detected.')
      await handleSelectMenu(interaction, 'slightColors', 'fullColors')
    }
  }
})

// handle the case where an admin manually removes a role
client.on('roleDelete', async (role) => {
  const guildId = role.guild.id
  const colorRole = await ColorRole.findOne({ guildId })

  if (colorRole) {
    let removed = false

    ;['customVerySlight', 'customSlight', 'customFull'].forEach(async (category) => {
      const index = colorRole[category].findIndex((item) => item.roleId === role.id)
      if (index > -1) {
        colorRole[category].splice(index, 1)
        removed = true
        console.log(`Removed ${role.name} from ${category}.`)
      }
    })

    if (removed) {
      await colorRole.save()
    }
  }
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DATABASE CONNECTED'))
  .catch((e) => console.log('DB CONNECTION ERROR: ', e))

//  Initialize Twitch clients for all streamers if the bot is restarted or crashes
const initializeTwitchClients = async () => {
  try {
    const streamers = await Streamer.find({})
    streamers.forEach((streamer) => {
      setupTwitchClient(streamer.twitchStreamername)
    })
  } catch (error) {
    console.error('Error initializing Twitch clients:', error)
  }
}

// deploy global commands when bot joins a new guild
client.on(Events.GuildCreate, () => {
  deployCommands
})

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
  initializeTwitchClients()
})

client.login(process.env.DISCORD_TOKEN)

// twitch commands
const {
  createColorRewards,
  createEventSubCommand,
  dumpEventSubsCommand,
  eventSubListCommand,
  getStreamerData,
} = require('./utils/twitchCmdUtils')

createColorRewards()
createEventSubCommand()
dumpEventSubsCommand()
eventSubListCommand()
getStreamerData()
