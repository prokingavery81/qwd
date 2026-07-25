const {
    SlashCommandBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {

    data: new SlashCommandBuilder()

        .setName("skip")

        .setDescription("Skip the current song"),



    async execute(interaction) {


        const player = getPlayer();



        if (!player) {

            return interaction.reply({

                content: "❌ Music system is not loaded.",
                ephemeral: true

            });

        }



        const queue = player.nodes.get(

            interaction.guild.id

        );



        if (!queue || !queue.isPlaying()) {

            return interaction.reply({

                content: "❌ Nothing is currently playing.",
                ephemeral: true

            });

        }



        const song = queue.currentTrack;



        queue.node.skip();



        await interaction.reply({

            content:
            `⏭️ Skipped **${song.title}**`

        });


    }

};