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


        .setName("gift")


        .setDescription(

            "Give coins to another player"

        )


        .addUserOption(option =>


            option

            .setName("user")

            .setDescription(

                "Who you want to gift"

            )

            .setRequired(true)


        )


        .addIntegerOption(option =>


            option

            .setName("amount")

            .setDescription(

                "Amount of coins"

            )

            .setRequired(true)


        ),






    async execute(interaction){



        const target =

        interaction.options.getUser(
            "user"
        );




        const amount =

        interaction.options.getInteger(
            "amount"
        );







        if(target.id === interaction.user.id){


            return interaction.reply({


                content:

                "❌ You cannot gift yourself.",


                ephemeral:true


            });


        }







        if(amount <= 0){


            return interaction.reply({


                content:

                "❌ Amount must be above 0.",


                ephemeral:true


            });


        }







        const economy =
        loadEconomy();



        const config =
        loadConfig();





        const sender =
        interaction.user.id;



        const receiver =
        target.id;







        if(!economy.users[sender]){


            economy.users[sender] = {


                coins:

                config.economy?.startingCoins || 0,


                lastDaily:0,


                lastWork:0


            };


        }






        if(!economy.users[receiver]){


            economy.users[receiver] = {


                coins:

                config.economy?.startingCoins || 0,


                lastDaily:0,


                lastWork:0


            };


        }








        if(

            economy.users[sender].coins < amount

        ){



            return interaction.reply({


                content:

                "❌ You don't have enough coins.",


                ephemeral:true


            });


        }








        economy.users[sender].coins -= amount;



        economy.users[receiver].coins += amount;







        saveEconomy(economy);







        const embed =

        new EmbedBuilder()



        .setColor("#00ff00")



        .setTitle(

            "🎁 Gift Sent"

        )



        .setDescription(


            `${interaction.user} gave ${target}\n\n` +


            `💰 **${amount.toLocaleString()} Coins**`


        )



        .setTimestamp();







        await interaction.reply({


            embeds:[embed]


        });



    }


};