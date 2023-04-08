const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voiceusers')
    .setDescription('Prints all users in the current voice channel'),
  async execute(interaction) {
    const member = interaction.member;
    const voiceState = member.voice;
    if (!voiceState.channel) {
      await interaction.reply({
        content: 'You need to join a voice channel first!',
        ephemeral: true,
      });
      return;
    }

    const channel = voiceState.channel;
    const users = channel.members.map((member) => member.user.tag);
    const userCount = users.length;

    let response = `There ${userCount === 1 ? 'is' : 'are'} ${userCount} ${
      userCount === 1 ? 'user' : 'users'
    } in ${channel.name}:`;

    response += users.reduce((acc, user) => {
      return `${acc}\n- ${user}`;
    }, '');

    await interaction.reply(response);
  },
};
