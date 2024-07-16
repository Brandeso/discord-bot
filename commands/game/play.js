const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const questions = require('../../questions.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Get a question'),
    async execute(interaction) {
        const question = questions[Math.floor(Math.random() * questions.length)];
        const A = new ButtonBuilder()
            .setCustomId('0')
            .setLabel(question.opciones[0])
            .setStyle(ButtonStyle.Secondary);
        const B = new ButtonBuilder()
            .setCustomId('1')
            .setLabel(question.opciones[1])
            .setStyle(ButtonStyle.Secondary);
        const C = new ButtonBuilder()
            .setCustomId('2')
            .setLabel(question.opciones[2])
            .setStyle(ButtonStyle.Secondary);
        const D = new ButtonBuilder()
            .setCustomId('3')
            .setLabel(question.opciones[3])
            .setStyle(ButtonStyle.Secondary);
        
        const row = new ActionRowBuilder()
            .addComponents(A, B, C, D)
        
        const response = await interaction.reply({
            content: question.pregunta,
            components: [row],
        })

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const collector = await response.awaitMessageComponent({ filter: collectorFilter, time:60_00 });
            console.log(collector.customId);

            if(question.opciones[parseInt(collector.customId)] === question.respuesta ) {
                await collector.update({
                    content: 'Correcto!',
                    components: []
                })
            } else {
                await collector.update({
                    content: 'Incorrecto! La respuesta correcta es ' + question.respuesta,
                    components: []
                })
            }

        } catch (error) {
            await interaction.editReply({
                content: 'Answer not recieved within a minute',
                components: []
            });
        }
    }
}