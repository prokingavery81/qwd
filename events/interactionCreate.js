const {
    Events,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("../config.json");


// ==================================================
// TICKET CREATION LOCK
// ==================================================

const ticketCreationLock = new Set();


module.exports = {

    name: Events.InteractionCreate,


    async execute(interaction, client) {


        // ==================================================
        // SLASH COMMANDS
        // ==================================================

        if (interaction.isChatInputCommand()) {


            const command =
                client.commands.get(
                    interaction.commandName
                );


            if (!command) {

                return interaction.reply({

                    content:
                        "❌ This command does not exist.",

                    flags: 64

                });

            }


            // ==================================================
            // BOT CHANNEL SYSTEM
            // ==================================================

            const botConfigPath =
                path.join(
                    __dirname,
                    "../data/config.json"
                );


            let botConfig = {

                botChannel: null

            };


            if (
                fs.existsSync(botConfigPath)
            ) {

                try {

                    botConfig =
                        JSON.parse(

                            fs.readFileSync(

                                botConfigPath,

                                "utf8"

                            )

                        );

                } catch (error) {

                    console.error(

                        "❌ Failed to read bot config:",

                        error

                    );

                }

            }


            if (

                botConfig.botChannel &&

                interaction.channel.id !==
                botConfig.botChannel

            ) {


                const member =
                    await interaction.guild.members.fetch(

                        interaction.user.id

                    );


                const bypassRoles = [

                    "Owner",
                    "Co Owner",
                    "Developer",
                    "Admin"

                ];


                const bypass =
                    member.roles.cache.some(

                        role =>
                            bypassRoles.includes(
                                role.name
                            )

                    );


                if (!bypass) {


                    if (
                        member.moderatable
                    ) {

                        await member.timeout(

                            10 * 60 * 1000,

                            "Used bot commands outside bot channel"

                        );

                    }


                    return interaction.reply({

                        content:

                            "❌ **Wrong channel!**\n\n" +

                            "Use bot commands in <#" +

                            botConfig.botChannel +

                            ">.\n\n" +

                            "⏳ You have been timed out for **10 minutes**.",

                        flags: 64

                    });

                }

            }


            // ==================================================
            // EXECUTE COMMAND
            // ==================================================

            try {

                await command.execute(

                    interaction,

                    client

                );

            } catch (error) {

                console.error(

                    `❌ Error executing /${interaction.commandName}:`,

                    error

                );


                if (

                    interaction.replied ||
                    interaction.deferred

                ) {

                    await interaction.editReply({

                        content:
                            "❌ An error occurred while running this command."

                    });

                } else {

                    await interaction.reply({

                        content:
                            "❌ An error occurred while running this command.",

                        flags: 64

                    });

                }

            }


            return;

        }


        // ==================================================
        // TICKET DROPDOWN
        // ==================================================

        if (

            interaction.isStringSelectMenu() &&

            interaction.customId ===
            "ticket_category"

        ) {


            const type =
                interaction.values[0];


            // ==================================================
            // CREATION LOCK
            // ==================================================

            const ticketKey =
                `${interaction.guild.id}-${interaction.user.id}`;


            if (

                ticketCreationLock.has(
                    ticketKey
                )

            ) {

                return interaction.reply({

                    content:
                        "⏳ Your ticket is already being created.",

                    flags: 64

                });

            }


            // ==================================================
            // CHECK EXISTING TICKET
            // ==================================================

            const existing =
                interaction.guild.channels.cache.find(

                    channel =>

                        channel.name ===
                        `ticket-${interaction.user.username.toLowerCase()}`

                );


            if (existing) {

                return interaction.reply({

                    content:
                        "❌ You already have an open ticket.",

                    flags: 64

                });

            }


            // LOCK BEFORE CREATION
            ticketCreationLock.add(
                ticketKey
            );


            try {


                // ==================================================
                // FIND TICKET CATEGORY
                // ==================================================

                const category =
                    interaction.guild.channels.cache.find(

                        channel =>

                            channel.name ===
                            config.ticketCategory &&

                            channel.type ===
                            ChannelType.GuildCategory

                    );


                // ==================================================
                // CREATE ONE TICKET
                // ==================================================

                const ticket =
                    await interaction.guild.channels.create({

                        name:
                            `ticket-${interaction.user.username.toLowerCase()}`,

                        type:
                            ChannelType.GuildText,

                        parent:
                            category?.id || null,

                        permissionOverwrites: [

                            {

                                id:
                                    interaction.guild.id,

                                deny: [

                                    PermissionsBitField.Flags.ViewChannel

                                ]

                            },


                            {

                                id:
                                    interaction.user.id,

                                allow: [

                                    PermissionsBitField.Flags.ViewChannel,

                                    PermissionsBitField.Flags.SendMessages,

                                    PermissionsBitField.Flags.ReadMessageHistory

                                ]

                            }

                        ]

                    });


                // ==================================================
                // CLOSE BUTTON
                // ==================================================

                const closeButton =
                    new ButtonBuilder()

                        .setCustomId(
                            "close_ticket"
                        )

                        .setLabel(
                            "🔒 Close Ticket"
                        )

                        .setStyle(
                            ButtonStyle.Danger
                        );


                const row =
                    new ActionRowBuilder()

                        .addComponents(

                            closeButton

                        );


                // ==================================================
                // PARTNERSHIP TICKET
                // ==================================================

                if (

                    type ===
                    "partnership"

                ) {


                    const embed =
                        new EmbedBuilder()

                            .setColor(

                                config.embedColor ||
                                "#a020f0"

                            )

                            .setTitle(

                                "🤝 Partnership Application"

                            )

                            .setDescription(

                                `Welcome ${interaction.user}!\n\n` +

                                "Please send the following information:\n\n" +

                                "📢 **1. Advertisement**\n" +

                                "Tell us about your server or community.\n\n" +

                                "🔗 **2. Discord Invite Link**\n" +

                                "Send your Discord server invite link.\n\n" +

                                "⭐ **3. Partnership Type**\n" +

                                "Tell us if you want a **VIP Partnership** or a **Normal Partnership**.\n\n" +

                                "💰 **4. Sponsorship Payment**\n" +

                                "Would you like sponsorship payment? Answer **Yes** or **No**.\n\n" +

                                "Please send all of this information in this ticket."

                            )

                            .setFooter({

                                text:
                                    "Ascension SMP • Partnership System"

                            })

                            .setTimestamp();


                    await ticket.send({

                        content:
                            `${interaction.user}`,

                        embeds: [

                            embed

                        ],

                        components: [

                            row

                        ]

                    });


                    return interaction.reply({

                        content:
                            `✅ Partnership ticket created: ${ticket}`,

                        flags: 64

                    });

                }


                // ==================================================
                // NORMAL TICKET
                // ==================================================

                const embed =
                    new EmbedBuilder()

                        .setColor(

                            config.embedColor ||
                            "#a020f0"

                        )

                        .setTitle(

                            "🎫 Ascension SMP Ticket"

                        )

                        .setDescription(

                            `Welcome ${interaction.user}!\n\n` +

                            `**Ticket Type:**\n${type}\n\n` +

                            "Please explain your issue and a staff member will assist you."

                        )

                        .setTimestamp();


                await ticket.send({

                    content:
                        `${interaction.user}`,

                    embeds: [

                        embed

                    ],

                    components: [

                        row

                    ]

                });


                return interaction.reply({

                    content:
                        `✅ Ticket created: ${ticket}`,

                    flags: 64

                });


            } catch (error) {


                console.error(

                    "❌ TICKET CREATION ERROR:",

                    error

                );


                return interaction.reply({

                    content:
                        "❌ There was an error creating your ticket.",

                    flags: 64

                });


            } finally {


                ticketCreationLock.delete(

                    ticketKey

                );

            }

        }


        // ==================================================
        // MUSIC SEARCH MENU
        // ==================================================

        if (

            interaction.isStringSelectMenu() &&

            interaction.customId ===
            "music_select"

        ) {


            const tracks =
                interaction.client.musicSearches?.get(

                    interaction.user.id

                );


            if (!tracks) {

                return interaction.reply({

                    content:
                        "❌ This music search has expired.",

                    flags: 64

                });

            }


            const track =
                tracks[

                    Number(

                        interaction.values[0]

                    )

                ];


            if (!track) {

                return interaction.reply({

                    content:
                        "❌ Track not found.",

                    flags: 64

                });

            }


            const {

                getPlayer

            } = require(

                "../music/manager"

            );


            const player =
                getPlayer();


            if (!player) {

                return interaction.reply({

                    content:
                        "❌ Music system is not loaded.",

                    flags: 64

                });

            }


            if (!interaction.member.voice.channel) {

                return interaction.reply({

                    content:
                        "❌ Join a voice channel first.",

                    flags: 64

                });

            }


            try {


                let queue =
                    player.nodes.get(

                        interaction.guild.id

                    );


                if (!queue) {

                    queue =
                        player.nodes.create(

                            interaction.guild,

                            {

                                metadata: {

                                    channel:
                                        interaction.channel

                                }

                            }

                        );

                }


                if (!queue.connection) {

                    await queue.connect(

                        interaction.member.voice.channel

                    );

                }


                await queue.addTrack(

                    track

                );


                if (!queue.isPlaying()) {

                    await queue.node.play();

                }


                return interaction.update({

                    content:
                        `🎵 Added **${track.title}** to the queue.`,

                    components: []

                });


            } catch (error) {


                console.error(

                    "❌ MUSIC ERROR:",

                    error

                );


                return interaction.reply({

                    content:
                        "❌ There was an error playing this track.",

                    flags: 64

                });

            }

        }


        // ==================================================
        // MUSIC BUTTONS
        // ==================================================

        if (

            interaction.isButton() &&

            interaction.customId.startsWith(

                "music_"

            )

        ) {


            const {

                getPlayer

            } = require(

                "../music/manager"

            );


            const player =
                getPlayer();


            if (!player) {

                return interaction.reply({

                    content:
                        "❌ Music system is not loaded.",

                    flags: 64

                });

            }


            const queue =
                player.nodes.get(

                    interaction.guild.id

                );


            if (!queue) {

                return interaction.reply({

                    content:
                        "❌ Nothing is currently playing.",

                    flags: 64

                });

            }


            switch (

                interaction.customId

            ) {


                case "music_pause":

                    queue.node.setPaused(

                        true

                    );

                    return interaction.reply({

                        content:
                            "⏸️ Music paused.",

                        flags: 64

                    });


                case "music_resume":

                    queue.node.setPaused(

                        false

                    );

                    return interaction.reply({

                        content:
                            "▶️ Music resumed.",

                        flags: 64

                    });


                case "music_skip":

                    await queue.node.skip();


                    return interaction.reply({

                        content:
                            "⏭️ Skipped the current song.",

                        flags: 64

                    });


                case "music_stop":

                    await queue.delete();


                    return interaction.reply({

                        content:
                            "⏹️ Music stopped.",

                        flags: 64

                    });


                default:

                    return interaction.reply({

                        content:
                            "❌ Unknown music action.",

                        flags: 64

                    });

            }

        }


        // ==================================================
        // ROLE SHOP BUY BUTTON
        // ==================================================

        if (

            interaction.isButton() &&

            interaction.customId.startsWith(

                "buyrole_"

            )

        ) {


            const economyPath =
                path.join(

                    __dirname,

                    "../data/economy.json"

                );


            const shopPath =
                path.join(

                    __dirname,

                    "../data/roleShop.json"

                );


            const roleId =
                interaction.customId.split(

                    "_"

                )[1];


            if (!fs.existsSync(shopPath)) {

                return interaction.reply({

                    content:
                        "❌ The role shop does not exist.",

                    flags: 64

                });

            }


            const shop =
                JSON.parse(

                    fs.readFileSync(

                        shopPath,

                        "utf8"

                    )

                );


            const item =
                shop.roles?.[roleId];


            if (!item) {

                return interaction.reply({

                    content:
                        "❌ This role is not available.",

                    flags: 64

                });

            }


            if (

                item.sold >=
                item.limit

            ) {

                return interaction.reply({

                    content:
                        "❌ This role is sold out.",

                    flags: 64

                });

            }


            if (!fs.existsSync(economyPath)) {

                return interaction.reply({

                    content:
                        "❌ Economy system is not set up.",

                    flags: 64

                });

            }


            const economy =
                JSON.parse(

                    fs.readFileSync(

                        economyPath,

                        "utf8"

                    )

                );


            const userId =
                interaction.user.id;


            if (!economy.users) {

                economy.users = {};

            }


            if (!economy.users[userId]) {

                economy.users[userId] = {

                    coins: 0,

                    lastDaily: 0,

                    lastWork: 0

                };

            }


            if (

                economy.users[userId].coins <
                item.cost

            ) {

                return interaction.reply({

                    content:
                        "❌ You do not have enough coins.",

                    flags: 64

                });

            }


            const role =
                interaction.guild.roles.cache.get(

                    roleId

                );


            if (!role) {

                return interaction.reply({

                    content:
                        "❌ This role no longer exists.",

                    flags: 64

                });

            }


            if (

                interaction.member.roles.cache.has(

                    roleId

                )

            ) {

                return interaction.reply({

                    content:
                        "❌ You already own this role.",

                    flags: 64

                });

            }


            try {

                await interaction.member.roles.add(

                    role

                );

            } catch (error) {

                console.error(

                    "❌ Failed to give role:",

                    error

                );


                return interaction.reply({

                    content:
                        "❌ I couldn't give you this role. Check the bot's role hierarchy.",

                    flags: 64

                });

            }


            economy.users[userId].coins -=

                item.cost;


            item.sold += 1;


            fs.writeFileSync(

                economyPath,

                JSON.stringify(

                    economy,

                    null,

                    4

                )

            );


            fs.writeFileSync(

                shopPath,

                JSON.stringify(

                    shop,

                    null,

                    4

                )

            );


            return interaction.reply({

                content:

                    `✅ You bought **${role.name}** for **${item.cost.toLocaleString()} Coins**!`,

                flags: 64

            });

        }


        // ==================================================
        // CLOSE TICKET
        // ==================================================

        if (

            interaction.isButton() &&

            interaction.customId ===

            "close_ticket"

        ) {


            await interaction.reply({

                content:
                    "🔒 This ticket will close in **3 seconds**.",

                flags: 64

            });


            setTimeout(

                () => {

                    interaction.channel

                        .delete()

                        .catch(

                            () => {}

                        );

                },

                3000

            );


            return;

        }

    }

};