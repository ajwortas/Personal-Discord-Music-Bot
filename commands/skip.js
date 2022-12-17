const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice')
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skip the current song'),
	async execute(interaction) {
		await interaction.reply(music.skip());
	},
};