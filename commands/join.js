const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice')
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins a voice channel')
			.addChannelOption(option => option.setName('channel')
			.setDescription("The song to be played")
			.setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel')
		let connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf:false,
			selfMute:false,

		})
		music.setConnection(connection)

		await interaction.reply('Joining...');
	},
};