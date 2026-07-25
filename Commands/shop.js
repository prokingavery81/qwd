const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const shopPath =
path.join(
    __dirname,
    "../data/roleShop.json"
);



module.exports = {


data:new SlashCommandBuilder()

.setName("shop")

.setDescription(
    "View the Ascension shop"
),





async execute(interaction){



if(!fs.existsSync(shopPath)){


return interaction.reply({

content:
"❌ No shop has been created yet.",

ephemeral:true

});


}






const data =

JSON.parse(

fs.readFileSync(

shopPath,

"utf8"

)

);







if(!data.roles || Object.keys(data.roles).length === 0){


return interaction.reply({

content:
"❌ The shop is empty.",

ephemeral:true

});


}







const embed =

new EmbedBuilder()

.setColor("#a020f0")

.setTitle(
"🛒 Ascension Shop"
)

.setDescription(
"Click a button below to purchase a role!"
)

.setTimestamp();






const rows = [];

let row =
new ActionRowBuilder();







for(const roleId of Object.keys(data.roles)){



const item =
data.roles[roleId];



const role =

interaction.guild.roles.cache.get(
roleId
);



if(!role)
continue;





const stock =

item.limit - item.sold;





embed.addFields({


name:

`⭐ ${role.name}`,



value:

`💰 Price: **${item.cost.toLocaleString()} Coins**\n`+

`📦 Stock: **${stock}/${item.limit}**`



});







const button =

new ButtonBuilder()

.setCustomId(

`buyrole_${roleId}`

)

.setLabel(

`Buy ${role.name}`

)

.setStyle(

ButtonStyle.Success

);







row.addComponents(button);







if(row.components.length === 5){


rows.push(row);


row =

new ActionRowBuilder();


}


}






if(row.components.length > 0){

rows.push(row);

}






await interaction.reply({


embeds:[embed],


components:rows


});



}


};