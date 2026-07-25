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

            embedColor:"#a020f0",

            economy:{

                startingCoins:0,

                dailyMin:500,

                dailyMax:1000

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


        .setName("daily")


        .setDescription(

            "Claim your daily Ascension Coins"

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


        }






        const user =

        economy.users[id];






        const now =

        Date.now();





        const cooldown =

        24 *

        60 *

        60 *

        1000;







        if(

            now - user.lastDaily < cooldown

        ){



            const remaining =

            cooldown -

            (now - user.lastDaily);





            const hours =

            Math.floor(

                remaining /

                (1000 * 60 * 60)

            );





            const minutes =

            Math.floor(

                (remaining %

                (1000 * 60 * 60))

                /

                (1000 * 60)

            );





            return interaction.reply({


                content:

                `⏳ You already claimed your daily reward!\nCome back in **${hours}h ${minutes}m**.`,



                ephemeral:true


            });



        }







        const min =

        config.economy?.dailyMin || 500;



        const max =

        config.economy?.dailyMax || 1000;






        const reward =

        Math.floor(

            Math.random() *

            (max - min + 1)

        )

        + min;








        user.coins += reward;



        user.lastDaily = now;






        saveEconomy(economy);








        const embed =

        new EmbedBuilder()


        .setColor(

            config.embedColor || "#a020f0"

        )


        .setTitle(

            "🎁 Daily Reward"

        )


        .setDescription(

            `${interaction.user}\n\n` +

            `⚔️ You received:\n` +

            `**+${reward.toLocaleString()} Ascension Coins**\n\n` +

            `Come back tomorrow!`

        )


        .setTimestamp();






        await interaction.reply({


            embeds:[embed]


        });



    }


};