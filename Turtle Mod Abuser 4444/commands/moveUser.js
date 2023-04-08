const { SlashCommandBuilder } = require('discord.js');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moveuser')
    .setDescription('Moves a random user from a specified voice channel to another voice channel')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The voice channel to pick a random user from').setRequired(true)
    ),
  async execute(interaction) {
    const hasRole = interaction.member.roles.cache.some(role => role.name === 'Turtle King');
    if (!hasRole) {
      await interaction.reply({
        content: 'You do not have permission to use this command!',
        ephemeral: true,
      });
      return;
    }

    const targetChannel = interaction.options.getChannel('channel');

    if (!targetChannel) {
      await interaction.reply({
        content: 'Invalid channel!',
        ephemeral: true,
      });
      return;
    }

    const targetUsers = targetChannel.members.filter(member => !member.user.bot && member.voice.channel);

    if (targetUsers.size === 0) {
      await interaction.reply({
        content: 'No users in the target channel!',
        ephemeral: true,
      });
      return;
    }

    const randomUser = targetUsers.random();
    const targetVoiceChannel = interaction.guild.channels.cache.get('840438108876046336');
    const originalChannel = randomUser.voice.channel;

    if (cooldowns.has(randomUser.id)) {
      const remainingTime = cooldowns.get(randomUser.id) - Date.now();
      if (remainingTime > 0) {
        await interaction.reply({
          content: `This command is on a ${Math.ceil(remainingTime / 1000)}-second cooldown!`,
          ephemeral: true,
        });
        return;
      }
    }
    
    const homeworkChannel = interaction.guild.channels.cache.get('738525322751901748');
    if (randomUser.voice.channel === homeworkChannel) {
      await interaction.reply({
        content: `${randomUser.displayName} is in the Homework channel and cannot be moved!`,
        ephemeral: true,
      });
      return;
    }

    await randomUser.voice.setChannel(targetVoiceChannel);
    await interaction.reply({
      content: `Moved ${randomUser.displayName} from ${originalChannel.name} to ${targetVoiceChannel.name}`,
      ephemeral: true,
    });

    setTimeout(async () => {
      await randomUser.voice.setChannel(originalChannel);
      await interaction.followUp({
        content: `Moved ${randomUser.displayName} back to ${originalChannel.name}`,
        ephemeral: true,
      });
      cooldowns.set(randomUser.id, Date.now() + 20000);
    }, 5000);
  },
};
