const { SlashCommandBuilder } = require('discord.js');
const music = require('../music/music.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('map a song to an identifier')
			.addStringOption(option => option.setName('song')
			.setDescription("The to be mapped")
			.setRequired(true))
            .addStringOption(option => option.setName('id')
			.setDescription("The name to be mapped to")
			.setRequired(true)
            ),
	async execute(interaction) {
		const song = interaction.options.getString('song');
        const id = interaction.options.getString('id');
		await interaction.reply(music.map(song,id));
	},
};