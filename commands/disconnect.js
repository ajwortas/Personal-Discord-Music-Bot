const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice')
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Joins a voice channel'),
	async execute(interaction) {
		await interaction.reply(music.disconnect());
	},
};