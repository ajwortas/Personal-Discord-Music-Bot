const { SlashCommandBuilder } = require('discord.js');
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays or adds a song to the queue')
			.addStringOption(option => option.setName('song')
			.setDescription("The song to be played")
			.setRequired(true)),
	async execute(interaction) {
		const song = interaction.options.getString('song');
		await interaction.reply(music.play(song));
	},
};
