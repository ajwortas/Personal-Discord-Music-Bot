const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice')
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('view the queue'),
	async execute(interaction) {
		
		await interaction.reply(music.viewQueue());
	},
};