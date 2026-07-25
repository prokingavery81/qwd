const {
    SlashCommandBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("volume")

        .setDescription("Change the music volume")

        .addIntegerOption(option =>

            option

            .setName("amount")

            .setDescription("Volume level 1-100")

            .setRequired(true)

            .setMinValue(1)

            .setMaxValue(100)

        ),



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



        if (!queue || !queue.node.isPlaying()) {

            return interaction.reply({

                content:
                "❌ Nothing is playing.",

                ephemeral:true

            });

        }



        const volume =
        interaction.options.getInteger(
            "amount"
        );



        queue.node.setVolume(
            volume
        );



        await interaction.reply({

            content:
            `🔊 Volume set to **${volume}%**`

        });


    }


};