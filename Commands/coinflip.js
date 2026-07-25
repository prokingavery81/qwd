const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const path = "./data/economy.json";



function loadEconomy() {


    if (!fs.existsSync("./data")) {

        fs.mkdirSync("./data");

    }


    if (!fs.existsSync(path)) {

        fs.writeFileSync(

            path,

            JSON.stringify({

                users:{}

            }, null, 4)

        );

    }


    return JSON.parse(

        fs.readFileSync(path)

    );


}




function saveEconomy(data) {


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

        .setName("coinflip")

        .setDescription(
            "Risk coins in a coin flip"
        )

        .addIntegerOption(option =>

            option

            .setName("amount")

            .setDescription(
                "Amount to bet"
            )

            .setRequired(true)

        )

        .addStringOption(option =>

            option

            .setName("choice")

            .setDescription(
                "Heads or Tails"
            )

            .setRequired(true)

            .addChoices(

                {
                    name:"🪙 Heads",
                    value:"heads"
                },

                {
                    name:"🪙 Tails",
                    value:"tails"
                }

            )

        ),





    async execute(interaction) {



        const amount =

        interaction.options.getInteger("amount");



        const choice =

        interaction.options.getString("choice");





        if(amount <= 0) {


            return interaction.reply({

                content:
                "❌ Bet must be above 0.",

                ephemeral:true

            });


        }





        const economy =
        loadEconomy();



        const id =
        interaction.user.id;





        if(!economy.users[id]) {


            economy.users[id] = {

                coins:1000,

                lastDaily:0

            };


        }






        const user =
        economy.users[id];





        if(user.coins < amount) {


            return interaction.reply({

                content:
                "❌ You don't have enough coins.",

                ephemeral:true

            });


        }






        const result =

        Math.random() < 0.5

        ? "heads"

        : "tails";





        let won =

        result === choice;






        if(won) {


            user.coins += amount;



        } else {


            user.coins -= amount;



            if(user.coins < 0) {

                user.coins = 0;

            }


        }





        saveEconomy(economy);






        const embed =

        new EmbedBuilder()

        .setColor(

            won ? "#00ff00" : "#ff0000"

        )

        .setTitle(
            "🪙 Coinflip"
        )

        .setDescription(

            `${interaction.user}\n\n` +

            `Your choice: **${choice}**\n` +

            `Result: **${result}**\n\n` +

            (

                won

                ?

                `✅ You won **${amount.toLocaleString()} Coins**`

                :

                `❌ You lost **${amount.toLocaleString()} Coins**`

            )

            +

            `\n\n💰 Balance: **${user.coins.toLocaleString()} Coins**`

        )

        .setTimestamp();







        await interaction.reply({

            embeds:[embed]

        });



    }


};