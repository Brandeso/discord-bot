const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input')
        .addStringOption(option => 
            option.setName('answer')
            .setDescription('Answer to the trivia question')
            .setRequired(true)
            .addChoices(
                { name: 'Yes', value: 'yes' },
                { name: 'No', value: 'no' }
            )
        ),
    async execute(interaction) {
        const answer = interaction.options.getString('answer');

        if(answer == 'yes') await interaction.reply('Answer was yes!');
        else if(answer == 'no') await interaction.reply('Answer was no!');
    }
}