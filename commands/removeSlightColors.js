const { SlashCommandBuilder, SelectMenuBuilder } = require('@discordjs/builders')
const ColorRole = require('../models/ColorRole.js')
const { ActionRowBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('remove-slight-color').setDescription('Remove a custom slight color role.'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.')
    }

    const guildId = interaction.guild.id
    const colorRole = await ColorRole.findOne({ guildId })

    if (!colorRole || colorRole.customSlight.length === 0) {
      return interaction.reply('There are no custom slight color roles to remove.')
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('remove-slight-color')
      .setPlaceholder('Select a color to remove')
      .addOptions(
        colorRole.customSlight.map((colorObj) => ({
          label: colorObj.color,
          value: `${colorObj.color.slice(1)}-${colorObj.roleId}`,
        }))
      )

    const actionRow = new ActionRowBuilder().addComponents(selectMenu)

    await interaction.reply({
      content: 'Select a custom slight color role to remove:',
      components: [actionRow],
    })
  },
}
