const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


module.exports = {

data: new SlashCommandBuilder()

.setName("congratsrank")

.setDescription("Set the role given at level 100")

.setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
)

.addRoleOption(option =>
    option
    .setName("role")
    .setDescription("Role to give at max level")
    .setRequired(true)
),


async execute(interaction){


const role =
interaction.options.getRole("role");


let data = {};


if(fs.existsSync("./congratsrank.json")) {

    data = JSON.parse(
        fs.readFileSync(
            "./congratsrank.json",
            "utf8"
        )
    );

}



data[interaction.guild.id] = role.id;



fs.writeFileSync(

    "./congratsrank.json",

    JSON.stringify(
        data,
        null,
        4
    )

);



interaction.reply({

content:
`✅ Level 100 congratulations role set to ${role}`,

ephemeral:true

});


}

};