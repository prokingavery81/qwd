const {
    SlashCommandBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("loop")

        .setDescription("Change the music loop mode")

        .addStringOption(option =>

            option

            .setName("mode")

            .setDescription("Choose loop mode")

            .setRequired(true)

            .addChoices(

                {
                    name:"❌ Off",
                    value:"off"
                },

                {
                    name:"🔂 Current Song",
                    value:"track"
                },

                {
                    name:"🔁 Queue",
                    value:"queue"
                }

            )

        ),



    async execute(interaction) {


        const player =
        getPlayer();



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



        const mode =
        interaction.options.getString(
            "mode"
        );



        let repeatMode;



        if(mode === "off") {

            repeatMode = 0;

        }


        if(mode === "track") {

            repeatMode = 1;

        }


        if(mode === "queue") {

            repeatMode = 2;

        }



        queue.setRepeatMode(
            repeatMode
        );



        const names = {

            0:"❌ Loop disabled",

            1:"🔂 Looping current song",

            2:"🔁 Looping queue"

        };



        await interaction.reply({

            content:
            names[repeatMode]

        });


    }


};