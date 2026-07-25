const {
    SlashCommandBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("stop")

        .setDescription("Stop music and clear the queue"),



    async execute(interaction) {


        const player = getPlayer();



        if (!player) {

            return interaction.reply({

                content:
                "❌ Music system is not loaded.",

                ephemeral: true

            });

        }



        const queue =
        player.nodes.get(

            interaction.guild.id

        );



        if (!queue) {

            return interaction.reply({

                content:
                "❌ Nothing is playing.",

                ephemeral: true

            });

        }



        try {


            queue.delete();



            await interaction.reply({

                content:
                "⏹️ Stopped music and cleared the queue."

            });



        } catch(error) {


            console.error(
                "[STOP ERROR]",
                error
            );



            await interaction.reply({

                content:
                "❌ Failed to stop music.",

                ephemeral:true

            });

        }


    }


};