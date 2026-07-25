const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
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

                startingCoins:0

            },

            boxes:{


                minimumBet:10,


                winMultiplier:2


            }


        };


    }



    return JSON.parse(

        fs.readFileSync(

            configPath,

            "utf8"

        )

    );


}module.exports = {


data:new SlashCommandBuilder()

.setName("boxes")

.setDescription(
    "Play the mystery boxes game"
)

.addIntegerOption(option =>

    option

    .setName("amount")

    .setDescription(
        "Amount of coins to bet"
    )

    .setRequired(true)

),






async execute(interaction){



    const config =
    loadConfig();




    const amount =

    interaction.options.getInteger(
        "amount"
    );





    const minimum =

    config.boxes?.minimumBet || 10;






    if(amount < minimum){


        return interaction.reply({


            content:

            `❌ Minimum bet is **${minimum} coins**.`,



            ephemeral:true


        });


    }








    const economy =
    loadEconomy();




    const userId =
    interaction.user.id;








    if(!economy.users[userId]){


        economy.users[userId] = {


            coins:

            config.economy?.startingCoins || 0,


            lastDaily:0,


            lastWork:0


        };


    }









    const user =

    economy.users[userId];








    if(user.coins < amount){



        return interaction.reply({


            content:

            "❌ You don't have enough coins.",



            ephemeral:true


        });


    }








    // Remove bet immediately

    user.coins -= amount;





    saveEconomy(economy);









    let boxes = [


        "green",

        "green",

        "green",

        "green",

        "green",

        "green",

        "green",

        "red",

        "red"


    ];








    // Shuffle boxes

    for(

        let i = boxes.length - 1;

        i > 0;

        i--

    ){


        const j =

        Math.floor(

            Math.random() *

            (i + 1)

        );




        [

            boxes[i],

            boxes[j]

        ] = [

            boxes[j],

            boxes[i]

        ];


    }








    const multiplier =

    config.boxes?.winMultiplier || 2;






    const game = {


        owner:userId,


        amount:amount,



        reward:

        amount * multiplier,



        boxes:boxes,



        opened:[]


    };









    const embed =

    new EmbedBuilder()



    .setTitle(

        "📦 Mystery Boxes"

    )



    .setColor(

        config.embedColor || "#a020f0"

    )



    .setDescription(


        `💰 Bet: **${amount.toLocaleString()} Coins**\n`+

        `🏆 Win Reward: **${game.reward.toLocaleString()} Coins**\n\n`+

        "🟩 Safe box\n"+

        "🟥 Losing box\n\n"+

        "Open all green boxes to win!"

    );








    const rows = [];





    for(let r = 0; r < 3; r++){


        const row =

        new ActionRowBuilder();






        for(let c = 0; c < 3; c++){


            const index =

            r * 3 + c;






            row.addComponents(


                new ButtonBuilder()


                .setCustomId(

                    `box_${index}_${userId}`

                )


                .setLabel(

                    "📦"

                )


                .setStyle(

                    ButtonStyle.Secondary

                )


            );


        }





        rows.push(row);


    }








    await interaction.reply({


        embeds:[embed],


        components:rows


    });






    const message =

    await interaction.fetchReply();
    const collector =

    message.createMessageComponentCollector({

        time:60000

    });







    collector.on(

        "collect",

        async button => {



            if(

                button.user.id !== game.owner

            ){


                return button.reply({


                    content:

                    "❌ This is not your game.",


                    ephemeral:true


                });


            }







            const index =

            Number(

                button.customId.split("_")[1]

            );








            if(

                game.opened.includes(index)

            ){



                return button.reply({


                    content:

                    "❌ You already opened this box.",


                    ephemeral:true


                });


            }








            game.opened.push(index);







            const result =

            game.boxes[index];








            // RED BOX = LOSE


            if(result === "red"){



                const loseEmbed =

                new EmbedBuilder()



                .setTitle(

                    "💥 You Lost!"

                )



                .setColor(

                    "#ff0000"

                )



                .setDescription(


                    `You opened a 🟥 losing box!\n\n`+

                    `💸 Lost: **${game.amount.toLocaleString()} Coins**`

                );







                await button.update({


                    embeds:[loseEmbed],


                    components:[]


                });






                collector.stop();


                return;


            }









            const remaining =

            game.boxes.filter(

                (box,i) =>


                box === "green"

                &&

                !game.opened.includes(i)


            ).length;








            // PLAYER WON


            if(remaining === 0){



                const economy =

                loadEconomy();






                if(!economy.users[game.owner]){


                    economy.users[game.owner] = {


                        coins:0,


                        lastDaily:0,


                        lastWork:0


                    };


                }







                economy.users[game.owner].coins +=

                game.reward;







                saveEconomy(economy);









                const winEmbed =

                new EmbedBuilder()



                .setTitle(

                    "🎉 You Won!"

                )



                .setColor(

                    "#ffd700"

                )



                .setDescription(


                    "You opened every green box!\n\n"+

                    `🏆 Won: **${game.reward.toLocaleString()} Coins**`

                );









                await button.update({



                    embeds:[winEmbed],



                    components:[]



                });







                collector.stop();


                return;


            }








            // Update opened button



            const newRows =

            message.components.map(row => {



                const newRow =

                new ActionRowBuilder();







                row.components.forEach(component => {



                    const newButton =

                    ButtonBuilder.from(

                        component

                    );






                    if(

                        newButton.data.custom_id ===

                        button.customId

                    ){



                        newButton

                        .setLabel(

                            "🟩"

                        )

                        .setStyle(

                            ButtonStyle.Success

                        )

                        .setDisabled(true);



                    }







                    newRow.addComponents(

                        newButton

                    );


                });







                return newRow;


            });








            await button.update({



                embeds:[


                    new EmbedBuilder()



                    .setTitle(

                        "📦 Mystery Boxes"

                    )



                    .setColor(

                        "#a020f0"

                    )



                    .setDescription(


                        "✅ Safe box!\n\n"+

                        `🟩 Safe boxes remaining: **${remaining}**\n\n`+

                        "Keep going!"

                    )


                ],



                components:newRows



            });




        }

    );    collector.on(

        "end",

        async()=>{


            try{


                await message.edit({


                    components:[]


                });


            }catch{}



        }


    );



}


};