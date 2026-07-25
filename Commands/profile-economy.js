const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const path = "./data/economy.json";


function loadEconomy(){

    if(!fs.existsSync(path)){

        return {
            users:{}
        };

    }

    return JSON.parse(
        fs.readFileSync(path)
    );

}



module.exports = {

    data: new SlashCommandBuilder()

    .setName("profile-economy")

    .setDescription(
        "View your economy profile"
    )

    .addUserOption(option =>

        option

        .setName("user")

        .setDescription(
            "View another player's profile"
        )

        .setRequired(false)

    ),



    async execute(interaction){


        const economy =
        loadEconomy();



        const target =

        interaction.options.getUser("user")
        ||
        interaction.user;



        const id =
        target.id;



        if(!economy.users[id]){


            return interaction.reply({

                content:
                "❌ This player has no economy data yet.",

                ephemeral:true

            });


        }




        const user =
        economy.users[id];





        const embed =

        new EmbedBuilder()

        .setColor("#a020f0")

        .setTitle(
            `👤 ${target.username}'s Economy Profile`
        )

        .setThumbnail(
            target.displayAvatarURL()
        )

        .addFields(

            {
                name:"💰 Coins",
                value:
                `${(user.coins || 0).toLocaleString()}`,
                inline:true
            },

            {
                name:"🎲 Coinflip Wins",
                value:
                `${user.wins || 0}`,
                inline:true
            },

            {
                name:"💥 Coinflip Losses",
                value:
                `${user.losses || 0}`,
                inline:true
            },

            {
                name:"📦 Boxes Opened",
                value:
                `${user.boxes || 0}`,
                inline:true
            }

        )

        .setTimestamp();




        await interaction.reply({

            embeds:[embed]

        });



    }

};