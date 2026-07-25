const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("rankannounce")

        .setDescription("Set the channel where level ups are announced")

        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel for rank up announcements")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),



    async execute(interaction) {


        const channel =
        interaction.options.getChannel("channel");



        let config = {};

        if(fs.existsSync("./rankconfig.json")) {

            config = JSON.parse(
                fs.readFileSync("./rankconfig.json")
            );

        }



        config.announceChannel =
        channel.id;



        fs.writeFileSync(

            "./rankconfig.json",

            JSON.stringify(
                config,
                null,
                4
            )

        );



        await interaction.reply({

            content:
            `✅ Rank up announcements will now be sent in ${channel}`,

            ephemeral:true

        });


    }

};