const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("rankwhitelist")
        .setDescription("Manage channels that do not give XP")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addSubcommand(sub =>
            sub
                .setName("add")
                .setDescription("Stop XP in a channel")

                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Channel to disable XP")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("remove")
                .setDescription("Allow XP in a channel again")

                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Channel to enable XP")
                        .setRequired(true)
                )
        ),



    async execute(interaction) {


        let config = {
            ignoredChannels: []
        };


        if(fs.existsSync("./rankconfig.json")) {

            config = JSON.parse(
                fs.readFileSync(
                    "./rankconfig.json",
                    "utf8"
                )
            );

        }



        const channel =
        interaction.options.getChannel("channel");


        const action =
        interaction.options.getSubcommand();



        if(action === "add") {


            if(!config.ignoredChannels.includes(channel.id)) {

                config.ignoredChannels.push(channel.id);

            }


            await interaction.reply({

                content:
                `✅ ${channel} has been added to the XP blacklist.`,

                ephemeral:true

            });


        }



        if(action === "remove") {


            config.ignoredChannels =
            config.ignoredChannels.filter(
                id => id !== channel.id
            );


            await interaction.reply({

                content:
                `✅ ${channel} can now give XP again.`,

                ephemeral:true

            });


        }



        fs.writeFileSync(

            "./rankconfig.json",

            JSON.stringify(
                config,
                null,
                4
            )

        );


    }

};