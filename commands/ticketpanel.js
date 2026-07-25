const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("ticketcreate")

        .setDescription("Create the Ascension SMP ticket panel")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),


    async execute(interaction) {


        // Extra permission protection

        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            return interaction.reply({

                content:
                "❌ You do not have permission to use this command.",

                ephemeral: true

            });

        }


        // Ticket panel embed

        const embed = new EmbedBuilder()

            .setColor("#a020f0")

            .setTitle("🎫 Ascension SMP Support")

            .setDescription(
`
Need help? Select a ticket category below and our staff team will assist you.

🚨 **Player Report**
Report a player breaking rules.

⚠️ **Issue Report**
Report a server or community issue.

🔧 **Technical Support**
Get help with bugs or technical problems.

💬 **Discord Problem**
Get help with Discord related issues.

🤝 **Partnership**
Apply for a partnership with Ascension SMP.

**Please provide details when creating a ticket.**
A staff member will respond as soon as possible.
`
            )

            .setFooter({

                text:
                "Ascension SMP • Support System"

            })

            .setTimestamp();


        // Ticket category dropdown

        const menu = new StringSelectMenuBuilder()

            .setCustomId(
                "ticket_category"
            )

            .setPlaceholder(
                "🎫 Select a ticket type..."
            )

            .addOptions([


                {

                    label:
                    "Player Report",

                    description:
                    "Report a player breaking rules",

                    value:
                    "player",

                    emoji:
                    "🚨"

                },


                {

                    label:
                    "Issue Report",

                    description:
                    "Report a server/community issue",

                    value:
                    "issue",

                    emoji:
                    "⚠️"

                },


                {

                    label:
                    "Technical Support",

                    description:
                    "Get technical assistance",

                    value:
                    "technical",

                    emoji:
                    "🔧"

                },


                {

                    label:
                    "Discord Problem",

                    description:
                    "Get Discord help",

                    value:
                    "discord",

                    emoji:
                    "💬"

                },


                {

                    label:
                    "Partnership",

                    description:
                    "Apply for a partnership with Ascension SMP",

                    value:
                    "partnership",

                    emoji:
                    "🤝"

                }


            ]);


        // Put menu inside an action row

        const row = new ActionRowBuilder()

            .addComponents(
                menu
            );


        // Send the ticket panel

        await interaction.reply({

            content:
            "✅ Ticket panel created!",

            embeds: [
                embed
            ],

            components: [
                row
            ]

        });


    }

};