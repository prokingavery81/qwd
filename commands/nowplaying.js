const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("nowplaying")

        .setDescription("Show the current song"),



    async execute(interaction) {


        const player = getPlayer();



        if (!player) {

            return interaction.reply({

                content:
                "❌ Music system is not loaded.",

                ephemeral:true

            });

        }



        const queue =
        player.nodes.get(

            interaction.guild.id

        );



        if (!queue || !queue.currentTrack) {

            return interaction.reply({

                content:
                "❌ Nothing is playing.",

                ephemeral:true

            });

        }



        const song =
        queue.currentTrack;



        const embed =
        new EmbedBuilder()

        .setTitle("🎵 Now Playing")

        .setDescription(

            `🎶 **${song.title}**\n\n` +

            `👤 Requested by: ${song.requestedBy || "Unknown"}\n\n` +

            `🔗 Source: ${song.url}`

        )

        .setThumbnail(
            song.thumbnail
        )

        .setColor("Purple");



        await interaction.reply({

            embeds:[embed]

        });


    }


};