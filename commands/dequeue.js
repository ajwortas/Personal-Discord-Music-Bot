const { SlashCommandBuilder } = require('discord.js');
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dequeue')
		.setDescription('dequeue the song from the queue')
			.addIntegerOption(option => option.setName('index')
			.setDescription("The index of the song to be dequeued")
			.setRequired(true)),
	async execute(interaction) {
		const idx = interaction.options.getString('index');
		await interaction.reply(music.dequeue(idx));
	},
};