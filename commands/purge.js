const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");


console.log("[DEBUG] purge.js loaded");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("purge")

        .setDescription("Delete a number of messages")

        .addIntegerOption(option =>

            option

            .setName("amount")

            .setDescription("Amount of messages to delete")

            .setRequired(true)

            .setMinValue(1)

            .setMaxValue(100)

        )


        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages
        ),






    async execute(interaction) {


        console.log(
            "[DEBUG] /purge executed by:",
            interaction.user.tag
        );



        try {



            if(

                !interaction.member.permissions.has(
                    PermissionFlagsBits.ManageMessages
                )

            ) {


                console.log(
                    "[DEBUG] Missing Manage Messages permission"
                );


                return interaction.reply({

                    content:
                    "❌ You don't have permission to use this command.",

                    ephemeral:true

                });


            }





            const amount =

            interaction.options.getInteger(
                "amount"
            );



            console.log(
                "[DEBUG] Amount requested:",
                amount
            );





            await interaction.deferReply({

                ephemeral:true

            });



            console.log(
                "[DEBUG] Deleting messages..."
            );





            const deleted =

            await interaction.channel.bulkDelete(

                amount,

                true

            );





            console.log(
                "[DEBUG] Deleted:",
                deleted.size
            );





            await interaction.editReply({

                content:
                `🧹 Deleted **${deleted.size}** messages.`

            });





        } catch(error) {


            console.error(
                "[PURGE ERROR]",
                error
            );



            if(interaction.deferred) {


                await interaction.editReply({

                    content:
                    "❌ Purge failed. Check bot permissions."

                });


            } else {


                await interaction.reply({

                    content:
                    "❌ Purge failed.",

                    ephemeral:true

                });


            }



        }



    }


};