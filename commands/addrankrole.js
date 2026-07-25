const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


module.exports = {

    data: new SlashCommandBuilder()

    .setName("addrankrole")

    .setDescription("Give a role when someone reaches a level")

    .addRoleOption(option =>
        option
        .setName("role")
        .setDescription("Role to give")
        .setRequired(true)
    )

    .addIntegerOption(option =>
        option
        .setName("level")
        .setDescription("Level required")
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
    ),



    async execute(interaction) {


        const role =
        interaction.options.getRole("role");


        const level =
        interaction.options.getInteger("level");



        let data = {};


        if(fs.existsSync("./rankroles.json")) {

            data = JSON.parse(
                fs.readFileSync("./rankroles.json")
            );

        }



        data[level] = role.id;



        fs.writeFileSync(

            "./rankroles.json",

            JSON.stringify(
                data,
                null,
                4
            )

        );



        await interaction.reply({

            content:
            `✅ ${role} will be given at level **${level}**`,

            ephemeral:true

        });


    }

};