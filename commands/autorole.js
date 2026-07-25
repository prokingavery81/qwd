const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("autorole")

        .setDescription("Set the role given to new members")

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role to give when someone joins")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),



    async execute(interaction) {


        const role =
        interaction.options.getRole("role");



        const botRole =
        interaction.guild.members.me.roles.highest;



        // Check if bot can give the role

        if (role.position >= botRole.position) {

            return interaction.reply({

                content:
                "❌ I can't use that role. The role must be below my bot role.",

                ephemeral: true

            });

        }



        // Save autorole settings

        let data = {};


        if (fs.existsSync("./autorole.json")) {

            data = JSON.parse(
                fs.readFileSync(
                    "./autorole.json",
                    "utf8"
                )
            );

        }



        data[interaction.guild.id] = role.id;



        fs.writeFileSync(

            "./autorole.json",

            JSON.stringify(
                data,
                null,
                4
            )

        );



        await interaction.reply({

            content:
            `✅ Autorole has been set to ${role}!\nNew members will receive this role when they join.`,

            ephemeral: true

        });


    }

};