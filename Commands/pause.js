const {
    SlashCommandBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {

    data: new SlashCommandBuilder()

        .setName("pause")

        .setDescription("Pause the current song"),



    async execute(interaction) {


        const player = getPlayer();



        if (!player) {

            return interaction.reply({

                content:
                "❌ Music system is not loaded.",

                ephemeral: true

            });

        }



        const queue = player.nodes.get(

            interaction.guild.id

        );



        if (!queue || !queue.isPlaying()) {

            return interaction.reply({

                content:
                "❌ Nothing is currently playing.",

                ephemeral: true

            });

        }



        queue.node.setPaused(true);



        await interaction.reply({

            content:
            "⏸️ Music paused."

        });


    }

};