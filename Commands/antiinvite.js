const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

const path = "./data/settings.json";


function loadSettings(){

    if(!fs.existsSync("./data")){
        fs.mkdirSync("./data");
    }


    if(!fs.existsSync(path)){

        fs.writeFileSync(
            path,
            JSON.stringify({})
        );

    }


    return JSON.parse(
        fs.readFileSync(path)
    );

}



function saveSettings(data){

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


data:

new SlashCommandBuilder()

.setName("antiinvite")

.setDescription(
"Enable or disable Discord invite protection"
)

.addStringOption(option =>

option

.setName("status")

.setDescription("on or off")

.setRequired(true)

.addChoices(

{
name:"On",
value:"on"
},

{
name:"Off",
value:"off"
}

)

)

.setDefaultMemberPermissions(
PermissionFlagsBits.Administrator
),




async execute(interaction){


const status =

interaction.options.getString(
"status"
);



const settings =
loadSettings();



if(!settings[interaction.guild.id]){

    settings[interaction.guild.id] = {};

}



settings[interaction.guild.id].antiInvite =
status === "on";



saveSettings(settings);





return interaction.reply({

content:

status === "on"

?

"✅ Anti Invite has been enabled."

:

"❌ Anti Invite has been disabled.",


ephemeral:true

});


}


};