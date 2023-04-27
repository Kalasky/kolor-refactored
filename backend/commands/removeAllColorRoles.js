const { SlashCommandBuilder } = require('@discordjs/builders')
const ColorRole = require('../models/ColorRole.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-all-color-roles')
    .setDescription('Remove all color roles for a specific category.')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Choose a category: slight, very-slight, or full')
        .setRequired(true)
        .addChoices(
          { name: 'Slight', value: 'slight' },
          { name: 'Very Slight', value: 'very-slight' },
          { name: 'Full', value: 'full' }
        )
    ),
  async execute(interaction) {
    // This is necessary to prevent the interaction from timing out.
    await interaction.deferReply()

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.')
    }

    // Get the category from the interaction options.
    const category = interaction.options.getString('category')
    const guildId = interaction.guild.id
    const colorRole = await ColorRole.findOne({ guildId })

    if (!colorRole) {
      return interaction.reply('No color roles have been created yet.')
    }

    // This is a mapping of the category names to the property names in the ColorRole model.
    const categoryMapping = {
      slight: 'customSlight',
      'very-slight': 'customVerySlight',
      full: 'customFull',
    }

    const categoryName = categoryMapping[category]

    // If the category name is not in the mapping, then the category is invalid.
    if (!colorRole[categoryName] || colorRole[categoryName].length === 0) {
      return interaction.reply(`There are no roles in the ${category} category to remove.`)
    }

    const removedRoleNames = []

    // Loop through the color roles in the category and delete them.
    for (const colorObj of colorRole[categoryName]) {
      const roleToRemove = interaction.guild.roles.cache.get(colorObj.roleId)
      if (roleToRemove) {
        removedRoleNames.push(roleToRemove.name)
        await roleToRemove.delete()
      }
    }

    const updateResult = await ColorRole.findOneAndUpdate({ guildId }, { [categoryName]: [] }, { new: true, overwrite: true })

    // If the update failed, then return an error message.
    if (!updateResult) {
      console.error('Error: Could not update the color role document.')
      return interaction.reply('An error occurred while removing the color roles. Please try again later.')
    }

    const removedRolesMessage = `Removed ${removedRoleNames.join(', ')} from ${categoryName}.`
    await interaction.editReply({ content: removedRolesMessage, ephemeral: true })
  },
}
