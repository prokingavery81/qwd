const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");


module.exports = {


data: new SlashCommandBuilder()

.setName("rank")

.setDescription("View your rank and XP"),



async execute(interaction){


let data = {};


if(fs.existsSync("./levels.json")) {

    data = JSON.parse(
        fs.readFileSync(
            "./levels.json",
            "utf8"
        )
    );

}



const user =
data[interaction.user.id] || {

    xp:0,

    level:1

};



const needed =
1000 + ((user.level - 1) * 250);



const progress =
Math.floor(
(user.xp / needed) * 100
);



const bars =
Math.floor(progress / 10);



const bar =
"█".repeat(bars) +
"░".repeat(10-bars);



const embed =
new EmbedBuilder()

.setColor("#a020f0")

.setTitle(
`🌟 ${interaction.user.username}'s Rank`
)

.setThumbnail(
interaction.user.displayAvatarURL()
)

.setDescription(
`
⭐ **Level**
${user.level}

✨ **XP**
${user.xp}/${needed}

${bar} ${progress}%
`
)

.setTimestamp();



interaction.reply({

    embeds:[embed]

});


}


};