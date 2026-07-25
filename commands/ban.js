const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("ban")

        .setDescription("Ban a member")

        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("User to ban")
            .setRequired(true)
        )

        .addStringOption(option =>
            option
            .setName("reason")
            .setDescription("Reason for ban")
            .setRequired(false)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers
        ),


    async execute(interaction) {


        const user =
        interaction.options.getUser("user");


        const reason =
        interaction.options.getString("reason")
        || "No reason provided";


        const member =
        await interaction.guild.members.fetch(user.id)
        .catch(() => null);



        if (!member) {

            return interaction.reply({

                content:
                "❌ That user is not in this server.",

                ephemeral:true

            });

        }


        if (!member.bannable) {

            return interaction.reply({

                content:
                "❌ I cannot ban that user. Make sure my role is higher.",

                ephemeral:true

            });

        }



        await member.ban({

            reason: reason

        });



        await interaction.reply({

            content:
            `🔨 ${user.tag} has been banned.\nReason: ${reason}`

        });


    }

};