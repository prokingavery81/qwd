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
        fs.readFileSync(path, "utf8")
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

.setName("antinuke")

.setDescription(
    "Enable or disable anti nuke protection"
)

.addStringOption(option =>

    option

    .setName("status")

    .setDescription(
        "Turn anti nuke on or off"
    )

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





settings[interaction.guild.id].antiNuke =

status === "on";






saveSettings(settings);








return interaction.reply({

content:

status === "on"

?

"🛡️ Anti-Nuke has been enabled."

:

"⚠️ Anti-Nuke has been disabled.",


ephemeral:true

});



}


};