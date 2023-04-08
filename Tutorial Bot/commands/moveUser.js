const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moveuser')
    .setDescription('Moves a user to a specified voice channel')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to move').setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The voice channel to move the user to')
        .setRequired(true)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const targetChannel = interaction.options.getChannel('channel');

    if (!targetUser || !targetChannel) {
      await interaction.reply({
        content: 'Invalid user or channel!',
        ephemeral: true,
      });
      return;
    }

    const member = interaction.guild.members.cache.get(targetUser.id);
    if (!member) {
      await interaction.reply({
        content: 'User is not a member of this server!',
        ephemeral: true,
      });
      return;
    }

    if (member.voice.channel) {
      await member.voice.setChannel(targetChannel);
      await interaction.reply({
        content: `Moved ${member.displayName} to ${targetChannel.name}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `${member.displayName} is not in a voice channel!`,
        ephemeral: true,
      });
    }
  },
};
