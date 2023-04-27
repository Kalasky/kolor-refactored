const ColorRole = require('../models/ColorRole.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const namer = require('color-namer')

const defaultSlightColors = ['#ff6666', '#ffc966', '#ffff66', '#66ff66', '#6666ff', '#66ffff']

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-slight-colors')
    .setDescription('Create slight color roles.')
    .addStringOption((option) =>
      option.setName('colors').setDescription('Hex codes separated by commas (without #) (e.g., FFC0CB,FFB6C1).')
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.')
    }

    const inputColors = interaction.options.getString('colors')
    const colors = inputColors
      ? inputColors.split(',').reduce((acc, curr) => {
          acc[`color${Object.keys(acc).length + 1}`] = `#${curr}` // Add # to the hex code
          return acc
        }, {})
      : defaultSlightColors // If no colors are provided, use the default colors

    const guildId = interaction.guild.id
    let colorRole = await ColorRole.findOne({ guildId })

    if (!colorRole) {
      colorRole = new ColorRole({ guildId })
    }

    // Clear the customSlight array before adding new colors
    colorRole.customSlight = []

    let rolesCreated = 0

    for (const color of Object.values(colors)) {
      // Check if the role already exists by hex color
      const existingRole = interaction.guild.roles.cache.find((role) => role.hexColor.toLowerCase() === color.toLowerCase())

      if (!existingRole) {
        const colorName = namer(color).ntc[0].name // Get the color name from the hex code

        /*
        NOTE: If you give the color-namer library a hex code that it hasn't 
        defined or doesn't have a specific name for, it will return the 
        closest color name based on the color space it uses for matching.
        */

        const newRole = await interaction.guild.roles.create({
          name: colorName, // Use the color name as the role name
          color,
        })

        const newColorObj = {
          color,
          roleId: newRole.id,
        }
        colorRole.customSlight.push(newColorObj)

        rolesCreated++
      } else {
        // If the role already exists, update the roleId in the customSlight array
        const index = colorRole.customSlight.findIndex((colorObj) => colorObj.color.toLowerCase() === color.toLowerCase())
        if (index > -1) {
          colorRole.customSlight[index].roleId = existingRole.id
        }
      }
    }

    await colorRole.save()

    if (rolesCreated === 0) {
      interaction.reply('All roles have already been created.')
    } else {
      interaction.reply(`Roles created! ${rolesCreated} new role(s) added.`)
    }
  },
}
