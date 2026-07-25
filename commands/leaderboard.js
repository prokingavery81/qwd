const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const path = "./data/economy.json";



function loadEconomy() {


    if (!fs.existsSync(path)) {

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

        .setName("leaderboard")

        .setDescription(
            "View the richest Ascension players"
        ),




    async execute(interaction) {


        const economy =
        loadEconomy();



        const members =
        interaction.guild.members.cache;



        let users = [];




        for (const id in economy.users) {


            const member =
            members.get(id);



            // Only show users in this Discord server

            if(member) {


                users.push({

                    id:id,

                    name:
                    member.user.username,

                    coins:
                    economy.users[id].coins || 0

                });


            }


        }





        users.sort(

            (a,b)=>

            b.coins - a.coins

        );





        const top =

        users.slice(0,10);





        if(top.length === 0) {


            return interaction.reply({

                content:
                "❌ No economy players found yet.",

                ephemeral:true

            });


        }





        let description = "";



        top.forEach(

            (user,index)=>{


                const medal =

                index === 0 ? "👑" :

                index === 1 ? "🥈" :

                index === 2 ? "🥉" :

                "⚔️";



                description +=

                `${medal} **${index + 1}. ${user.name}**\n` +

                `💰 ${user.coins.toLocaleString()} Coins\n\n`;


            }

        );







        const embed =

        new EmbedBuilder()

        .setColor("#a020f0")

        .setTitle(
            "🏆 Ascension Richest Players"
        )

        .setDescription(
            description
        )

        .setFooter({

            text:
            "Ascension SMP Economy"

        })

        .setTimestamp();







        await interaction.reply({

            embeds:[embed]

        });



    }


};