const Streamer = require('../models/Streamer')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-guild-id')
    .setDescription("This command tells the bot your Twitch community's Discord server")
    .addStringOption((option) => option.setName('twitch-username').setDescription('Your Twitch username').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.')
    }

    const guildId = interaction.guild.id
    const streamerTwitchUsername = interaction.options.getString('twitch-username')

    try {
      const streamer = await Streamer.findOne({ twitchStreamername: streamerTwitchUsername })

      if (!streamer) {
        return interaction.reply(
          'Streamer not found in the database. Make sure you have visited the website and authenticated with Twitch.'
        )
      }

      streamer.discordGuildID = guildId
      await streamer.save()

      await interaction.reply(`Guild ID has been set to ${guildId}.`)
    } catch (error) {
      console.error(error)
      interaction.reply('An error occurred while setting the guild ID.')
    }
  },
}
