const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


module.exports = {


    data: new SlashCommandBuilder()

        .setName("musicpanel")

        .setDescription("Create the music control panel"),



    async execute(interaction) {


        const embed = new EmbedBuilder()

            .setTitle("🎵 Ascension Music")

            .setDescription(
`
Use the buttons below to control the music.

▶️ Play / Resume
⏸️ Pause
⏭️ Skip
⏹️ Stop
📜 Queue
🔂 Loop
`
            )

            .setColor("Purple");



        const row1 = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

            .setCustomId("music_resume")

            .setLabel("▶️ Resume")

            .setStyle(ButtonStyle.Success),



            new ButtonBuilder()

            .setCustomId("music_pause")

            .setLabel("⏸️ Pause")

            .setStyle(ButtonStyle.Secondary),



            new ButtonBuilder()

            .setCustomId("music_skip")

            .setLabel("⏭️ Skip")

            .setStyle(ButtonStyle.Primary),



            new ButtonBuilder()

            .setCustomId("music_stop")

            .setLabel("⏹️ Stop")

            .setStyle(ButtonStyle.Danger)

        );



        const row2 = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

            .setCustomId("music_queue")

            .setLabel("📜 Queue")

            .setStyle(ButtonStyle.Secondary),



            new ButtonBuilder()

            .setCustomId("music_loop")

            .setLabel("🔂 Loop")

            .setStyle(ButtonStyle.Primary)

        );



        await interaction.reply({

            embeds:[embed],

            components:[row1,row2]

        });


    }


};