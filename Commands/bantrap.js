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
        fs.readFileSync(path,"utf8")
    );

}




function saveSettings(data){

    fs.writeFileSync(
        path,
        JSON.stringify(data,null,4)
    );

}





module.exports = {


data:

new SlashCommandBuilder()

.setName("bantrap")

.setDescription(
"Setup ban trap protection"
)



.addStringOption(option =>

    option
    .setName("status")
    .setDescription("Turn ban trap on or off")
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



.addChannelOption(option =>

    option
    .setName("setchannel")
    .setDescription("Ban trap channel")
    .setRequired(false)

)



.addChannelOption(option =>

    option
    .setName("banlogs")
    .setDescription("Ban log channel")
    .setRequired(false)

)



.setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
),






async execute(interaction){



const settings =
loadSettings();



const guildId =
interaction.guild.id;





if(!settings[guildId]){

    settings[guildId] = {};

}





const status =

interaction.options.getString(
    "status"
);




const trapChannel =

interaction.options.getChannel(
    "setchannel"
);




const logChannel =

interaction.options.getChannel(
    "banlogs"
);







if(status === "on"){



    if(!trapChannel){

        return interaction.reply({

            content:
            "❌ Select a trap channel.",

            ephemeral:true

        });

    }






    settings[guildId].banTrap = {


        enabled:true,

        channelId:
        trapChannel.id,

        logs:
        logChannel?.id || null


    };





    saveSettings(settings);





    return interaction.reply({

        content:
        `🚨 Ban Trap enabled\n\nTrap: ${trapChannel}\nLogs: ${logChannel || "Not set"}`,

        ephemeral:true

    });


}








settings[guildId].banTrap = {


    enabled:false,

    channelId:null,

    logs:null


};






saveSettings(settings);






return interaction.reply({

    content:
    "✅ Ban Trap disabled.",

    ephemeral:true

});



}


};