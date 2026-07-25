const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const configPath =
    path.join(
        __dirname,
        "../data/config.json"
    );



module.exports = {


    data: new SlashCommandBuilder()

        .setName("botchannel")

        .setDescription(
            "Set the channel where bot commands can be used"
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addChannelOption(option =>

            option

            .setName("setchannel")

            .setDescription(
                "Channel for bot commands"
            )

            .setRequired(true)

        ),




    async execute(interaction){



        let config = {};



        if(fs.existsSync(configPath)){


            config = JSON.parse(

                fs.readFileSync(
                    configPath,
                    "utf8"
                )

            );


        }



        const channel =

        interaction.options.getChannel(
            "setchannel"
        );





        config.botChannel =
        channel.id;




        fs.writeFileSync(

            configPath,

            JSON.stringify(

                config,

                null,

                4

            )

        );





        await interaction.reply({


            content:

            `✅ Bot commands are now locked to ${channel}.`,


            ephemeral:true


        });


    }


};