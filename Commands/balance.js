const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const economyPath =
    path.join(
        __dirname,
        "../data/economy.json"
    );


const configPath =
    path.join(
        __dirname,
        "../data/config.json"
    );





function loadEconomy(){


    if(!fs.existsSync(economyPath)){


        fs.writeFileSync(

            economyPath,

            JSON.stringify(

                {
                    users:{}
                },

                null,

                4

            )

        );


    }



    return JSON.parse(

        fs.readFileSync(
            economyPath,
            "utf8"
        )

    );


}






function saveEconomy(data){


    fs.writeFileSync(

        economyPath,

        JSON.stringify(
            data,
            null,
            4
        )

    );


}






function loadConfig(){


    if(!fs.existsSync(configPath)){


        return {

            economy:{

                startingCoins:0

            }

        };


    }



    return JSON.parse(

        fs.readFileSync(
            configPath,
            "utf8"
        )

    );


}






module.exports = {


    data:new SlashCommandBuilder()

        .setName("balance")

        .setDescription(
            "Check your Ascension Coins"
        ),





    async execute(interaction){



        const economy =
        loadEconomy();



        const config =
        loadConfig();



        const id =
        interaction.user.id;






        if(!economy.users[id]){


            economy.users[id] = {


                coins:

                config.economy?.startingCoins || 0,


                lastDaily:0,


                lastWork:0


            };



            saveEconomy(economy);


        }






        const coins =

        economy.users[id].coins;







        const embed =

        new EmbedBuilder()


        .setColor(

            config.embedColor || "#a020f0"

        )


        .setTitle(
            "💰 Ascension Balance"
        )


        .setDescription(

            `${interaction.user}\n\n` +

            `⚔️ Coins: **${coins.toLocaleString()}**`

        )


        .setTimestamp();






        await interaction.reply({


            embeds:[embed]


        });



    }


};