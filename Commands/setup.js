const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("setup")

        .setDescription(
            "Setup Ascension SMP Discord"
        )

        .setDefaultMemberPermissions(

            PermissionFlagsBits.Administrator

        ),


    async execute(interaction) {


        if (

            !interaction.guild

        ) {

            return interaction.reply({

                content:

                    "❌ This command can only be used inside a server.",

                ephemeral: true

            });

        }


        const guild =

            interaction.guild;


        await interaction.reply({

            content:

                "⚙️ Setting up Ascension SMP...",

            ephemeral: true

        });


        // ==================================================
        // CREATE WELCOME CHANNEL
        // ==================================================

        let welcome =

            guild.channels.cache.find(

                c =>

                    c.name ===

                        "welcome" &&

                    c.type ===

                        ChannelType.GuildText

            );


        if (

            !welcome

        ) {

            welcome =

                await guild.channels.create({

                    name:

                        "welcome",

                    type:

                        ChannelType.GuildText

                });

        }


        // ==================================================
        // CREATE TICKET CATEGORY
        // ==================================================

        let category =

            guild.channels.cache.find(

                c =>

                    c.name ===

                        "Tickets" &&

                    c.type ===

                        ChannelType.GuildCategory

            );


        if (

            !category

        ) {

            category =

                await guild.channels.create({

                    name:

                        "Tickets",

                    type:

                        ChannelType.GuildCategory

                });

        }


        // ==================================================
        // CREATE TICKET PANEL CHANNEL
        // ==================================================

        let ticketChannel =

            guild.channels.cache.find(

                c =>

                    c.name ===

                        "ticket-panel" &&

                    c.type ===

                        ChannelType.GuildText

            );


        if (

            !ticketChannel

        ) {

            ticketChannel =

                await guild.channels.create({

                    name:

                        "ticket-panel",

                    type:

                        ChannelType.GuildText,

                    parent:

                        category.id

                });

        }


        // ==================================================
        // TICKET MENU
        // ==================================================

        const menu =

            new StringSelectMenuBuilder()

                .setCustomId(

                    "ticket_category"

                )

                .setPlaceholder(

                    "🎫 Choose a ticket type..."

                )

                .addOptions([


                    {

                        label:

                            "Report Player",

                        description:

                            "Report a player breaking rules",

                        value:

                            "player",

                        emoji:

                            "🚨"

                    },


                    {

                        label:

                            "Report Issue",

                        description:

                            "Report a server issue",

                        value:

                            "issue",

                        emoji:

                            "⚠️"

                    },


                    {

                        label:

                            "Technical Problems",

                        description:

                            "Get technical support",

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


        const row =

            new ActionRowBuilder()

                .addComponents(

                    menu

                );


        // ==================================================
        // TICKET EMBED
        // ==================================================

        const embed =

            new EmbedBuilder()

                .setColor(

                    "#a020f0"

                )

                .setTitle(

                    "🎫 Ascension SMP Support"

                )

                .setDescription(

`
Need help?

Choose a category below and our staff team will assist you.

🚨 **Report Player**
Report a player breaking the rules.

⚠️ **Report Issue**
Report a server or community issue.

🔧 **Technical Problems**
Get help with technical problems.

💬 **Discord Problem**
Get help with Discord-related issues.

🤝 **Partnership**
Apply for a partnership with Ascension SMP.
`

                )

                .setFooter({

                    text:

                        "Ascension SMP • Support System"

                })

                .setTimestamp();


        // ==================================================
        // SEND PANEL
        // ==================================================

        await ticketChannel.send({

            embeds: [

                embed

            ],

            components: [

                row

            ]

        });


        return interaction.editReply({

            content:

                "✅ Ascension SMP setup complete!"

        });


    }

};