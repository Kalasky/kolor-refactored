const { SlashCommandBuilder, SelectMenuBuilder } = require('@discordjs/builders')
const { ActionRowBuilder } = require('discord.js')

// models
const ColorRole = require('../models/ColorRole.js')
const UserColor = require('../models/UserColor.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trade-very-slight')
    .setDescription('Trade all your custom very slight color roles for a custom slight color role.'),
  async execute(interaction) {
    const guildId = interaction.guild.id
    const userId = interaction.user.id

    const colorRole = await ColorRole.findOne({ guildId })
    const userColor = await UserColor.findOne({ discordId: userId })

    if (!colorRole || !userColor) {
      return interaction.reply('An error occurred. Please try again later.')
    }

    const userHasAllVerySlight = colorRole.customVerySlight.every((colorObj) =>
      userColor.verySlightColors.includes(colorObj.roleId)
    )

    if (!userHasAllVerySlight) {
      return interaction.reply('You do not have all custom very slight color roles to trade.')
    }

    const member = interaction.guild.members.cache.get(userId)
    const availableRoles = colorRole.customSlight.filter((colorObj) => !member.roles.cache.has(colorObj.roleId))

    if (availableRoles.length === 0) {
      return interaction.reply('You already have all custom slight color roles.')
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('trade-customVerySlight-to-customSlight')
      .setPlaceholder('Select a slight color')
      .addOptions(
        availableRoles.map((colorObj) => ({
          label: colorObj.color,
          value: colorObj.roleId,
        }))
      )

    const actionRow = new ActionRowBuilder().addComponents(selectMenu)

    await interaction.reply({
      content: 'Select a custom slight color role to receive:',
      components: [actionRow],
    })
  },
}
