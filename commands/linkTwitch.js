// commands/linktwitch.js
const { SlashCommandBuilder } = require('@discordjs/builders')
const Streamer = require('../models/Streamer')

const { setupTwitchClient } = require('../utils/tmiSetup')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('linktwitch')
    .setDescription('Links your Twitch channel to this Discord server')
    .addStringOption((option) => option.setName('channel').setDescription('Your Twitch channel name').setRequired(true)),
  async execute(interaction) {
    const twitchChannel = interaction.options.getString('channel')
    const guildId = interaction.guild.id

    // Save the relationship between the Discord server and the Twitch channel to DB
    try {
      const existingLink = await Streamer.findOne({ discordGuildID: guildId })

      if (existingLink) {
        await Streamer.updateOne({ discordGuildID: guildId }, { twitchStreamername: twitchChannel })
      } else {
        const newStreamer = new Streamer({
          discordGuildID: guildId,
          twitchStreamername: twitchChannel,
          twitchBroadcasterID: 'TBD',
          twitchAccessToken: 'TBD',
          twitchRefreshToken: 'TBD',
        })
        await newStreamer.save()
      }

      // Initialize Twitch client with the linked Twitch channel
      await setupTwitchClient(twitchChannel)

      await interaction.reply(`Twitch channel "${twitchChannel}" has been linked to this Discord server.`)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while linking the Twitch channel to this Discord server. Please try again later.',
        ephemeral: true,
      })
    }
  },
}
