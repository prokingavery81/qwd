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



module.exports = {


data:new SlashCommandBuilder()

.setName("gamble")

.setDescription(
    "Gamble your coins"
)

.addIntegerOption(option =>

    option

    .setName("money")

    .setDescription(
        "Amount of coins to gamble"
    )

    .setRequired(true)

),





async execute(interaction){



const amount =
interaction.options.getInteger("money");



if(amount <= 0){

return interaction.reply({

content:
"❌ Enter a valid amount.",

ephemeral:true

});

}





const economy =

JSON.parse(

fs.readFileSync(
    economyPath,
    "utf8"
)

);





const id =
interaction.user.id;






if(!economy.users[id]){


economy.users[id] = {


coins:0,

lastDaily:0,

lastWork:0


};


}






if(amount > economy.users[id].coins){


return interaction.reply({

content:
"❌ You don't have enough coins.",

ephemeral:true

});


}





// remove bet

economy.users[id].coins -= amount;





const win =
Math.random() <= 0.25;



let result;





if(win){



const reward =
amount * 2;


economy.users[id].coins += reward;



result =

`🎉 **YOU WON!**\n\n`+

`🎰 Chance: 25%\n`+

`💰 Won: **${reward.toLocaleString()} Coins**`;



} else {



result =

`💀 **YOU LOST!**\n\n`+

`🎰 Chance: 75%\n`+

`💸 Lost: **${amount.toLocaleString()} Coins**`;



}







fs.writeFileSync(

economyPath,

JSON.stringify(

economy,

null,

4

)

);






const embed =

new EmbedBuilder()

.setColor("#a020f0")

.setTitle(
"🎰 Gamble"
)

.setDescription(
result
)

.addFields({

name:
"💰 New Balance",

value:
`${economy.users[id].coins.toLocaleString()} Coins`

})

.setTimestamp();





await interaction.reply({

embeds:[embed]

});



}


};