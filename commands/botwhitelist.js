const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


const path = "./data/security.json";



function loadSecurity() {

    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
    }


    if (!fs.existsSync(path)) {

        fs.writeFileSync(
            path,
            JSON.stringify({

                trapChannel: "",
                logChannel: "",
                whitelistedBots: []

            }, null, 4)
        );

    }


    return JSON.parse(
        fs.readFileSync(path)
    );

}



function saveSecurity(data) {

    fs.writeFileSync(

        path,

        JSON.stringify(
            data,
            null,
            4
        )

    );

}



module.exports = {


    data: new SlashCommandBuilder()

        .setName("botwhitelist")

        .setDescription(
            "Manage protected bots"
        )


        .addSubcommand(sub =>

            sub

            .setName("add")

            .setDescription(
                "Protect a bot"
            )

            .addUserOption(option =>

                option

                .setName("bot")

                .setDescription(
                    "Bot to protect"
                )

                .setRequired(true)

            )

        )


        .addSubcommand(sub =>

            sub

            .setName("remove")

            .setDescription(
                "Remove a protected bot"
            )

            .addUserOption(option =>

                option

                .setName("bot")

                .setDescription(
                    "Bot to unprotect"
                )

                .setRequired(true)

            )

        )


        .addSubcommand(sub =>

            sub

            .setName("list")

            .setDescription(
                "Show protected bots"
            )

        )


        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),




    async execute(interaction) {



        if(

            interaction.guild.ownerId !== interaction.user.id

        ){

            return interaction.reply({

                content:
                "❌ Only the server owner can use this.",

                ephemeral:true

            });

        }





        const security =
        loadSecurity();



        const action =
        interaction.options.getSubcommand();





        if(action === "add"){


            const bot =
            interaction.options.getUser("bot");



            if(!bot.bot){

                return interaction.reply({

                    content:
                    "❌ That user is not a bot.",

                    ephemeral:true

                });

            }





            if(

                !security.whitelistedBots.includes(
                    bot.id
                )

            ){

                security.whitelistedBots.push(
                    bot.id
                );

            }



            saveSecurity(
                security
            );



            return interaction.reply({

                content:
                `✅ ${bot.tag} is now protected.`,

                ephemeral:true

            });


        }






        if(action === "remove"){


            const bot =
            interaction.options.getUser("bot");



            security.whitelistedBots =

            security.whitelistedBots.filter(

                id => id !== bot.id

            );



            saveSecurity(
                security
            );



            return interaction.reply({

                content:
                `✅ ${bot.tag} removed from whitelist.`,

                ephemeral:true

            });


        }






        if(action === "list"){


            if(
                security.whitelistedBots.length === 0
            ){

                return interaction.reply({

                    content:
                    "No protected bots.",

                    ephemeral:true

                });

            }



            return interaction.reply({

                content:

                `🛡️ Protected Bots:\n` +

                security.whitelistedBots

                .map(id => `<@${id}>`)

                .join("\n"),

                ephemeral:true

            });


        }


    }


};