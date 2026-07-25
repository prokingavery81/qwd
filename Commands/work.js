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

                workCooldown:18000

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


        .setName("work")


        .setDescription(

            "Work to earn Ascension Coins"

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






        const cooldown =

        (config.economy?.workCooldown || 18000)

        * 1000;





        const now =

        Date.now();







        if(

            now - user.lastWork < cooldown

        ){



            const remaining =

            cooldown -

            (now - user.lastWork);





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

                `⏳ You can work again in **${hours}h ${minutes}m**.`,



                ephemeral:true


            });


        }







        const jobs = [



            {

                text:"⛏️ You mined rare diamonds!",

                min:200,

                max:600

            },



            {

                text:"🧙 You helped a wizard!",

                min:300,

                max:700

            },



            {

                text:"🏰 You defended the kingdom!",

                min:400,

                max:900

            },



            {

                text:"🌲 You collected resources!",

                min:150,

                max:500

            },



            {

                text:"🐉 You defeated a dragon!",

                min:700,

                max:1500

            }


        ];







        const failedJobs = [



            {

                text:"💀 A creeper destroyed your paycheck!",

                min:50,

                max:200

            },


            {

                text:"😵 You fell into lava!",

                min:100,

                max:300

            }


        ];







        const success =

        Math.random() > 0.15;







        const list =

        success

        ? jobs

        : failedJobs;







        const result =

        list[

            Math.floor(

                Math.random() *

                list.length

            )

        ];







        const amount =

        Math.floor(

            Math.random() *

            (result.max - result.min + 1)

        )

        + result.min;







        if(success){


            user.coins += amount;


        } else {


            user.coins -= amount;



            if(user.coins < 0){

                user.coins = 0;

            }


        }






        user.lastWork = now;





        saveEconomy(economy);








        const embed =

        new EmbedBuilder()


        .setColor(

            success

            ? "#00ff00"

            : "#ff0000"

        )


        .setTitle(

            "⚒️ Work Result"

        )


        .setDescription(

            `${interaction.user}\n\n` +

            `${result.text}\n\n` +

            `${success ? "💰 Earned" : "💸 Lost"} **${amount.toLocaleString()} Ascension Coins**`

        )


        .setFooter({

            text:

            "Next work available later"

        })


        .setTimestamp();







        await interaction.reply({


            embeds:[embed]


        });



    }


};