const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("unban")

        .setDescription("Unban a user using their ID")

        .addStringOption(option =>
            option
            .setName("id")
            .setDescription("Discord user ID")
            .setRequired(true)
        )

        .addStringOption(option =>
            option
            .setName("reason")
            .setDescription("Reason for unban")
            .setRequired(false)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers
        ),


    async execute(interaction) {


        const id =
        interaction.options.getString("id");


        const reason =
        interaction.options.getString("reason")
        || "No reason provided";



        try {


            await interaction.guild.bans.remove(
                id,
                reason
            );


            await interaction.reply({

                content:
                `✅ <@${id}> has been unbanned.\nReason: ${reason}`

            });


        } catch(error) {


            await interaction.reply({

                content:
                "❌ Could not unban that ID. Make sure it is a valid banned user ID.",

                ephemeral:true

            });


        }

    }

};