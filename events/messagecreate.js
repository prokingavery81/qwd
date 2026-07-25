const {
    Events,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");


// ==========================
// COOLDOWNS
// ==========================

const cooldowns = new Set();


// ==========================
// FILE PATHS
// ==========================

const settingsPath = path.join(
    __dirname,
    "../data/settings.json"
);

const rankConfigPath = path.join(
    __dirname,
    "../rankconfig.json"
);

const levelsPath = path.join(
    __dirname,
    "../levels.json"
);


// ==========================
// MESSAGE CREATE EVENT
// ==========================

module.exports = {

    name: Events.MessageCreate,


    async execute(message, client) {


        // ==========================
        // IGNORE BOTS
        // ==========================

        if (

            message.author.bot

        ) {

            return;

        }


        // ==========================
        // IGNORE DMS
        // ==========================

        if (

            !message.guild

        ) {

            return;

        }


        // ==========================
        // LOAD SETTINGS
        // ==========================

        let settings = {};


        if (

            fs.existsSync(

                settingsPath

            )

        ) {

            try {

                settings = JSON.parse(

                    fs.readFileSync(

                        settingsPath,

                        "utf8"

                    )

                );

            } catch (error) {

                console.error(

                    "❌ Failed to load settings.json:",

                    error

                );

            }

        }


        // ==================================================
        // BAN TRAP
        // ==================================================

        const trap =

            settings[

                message.guild.id

            ]?.banTrap;


        if (

            trap?.enabled &&

            trap.channelId ===

                message.channel.id

        ) {


            const isOwner =

                message.author.id ===

                message.guild.ownerId;


            const isAdmin =

                message.member.permissions.has(

                    PermissionFlagsBits.Administrator

                );


            if (

                !isOwner &&

                !isAdmin

            ) {


                // ==========================
                // DELETE MESSAGE
                // ==========================

                await message.delete()

                    .catch(

                        () => {}

                    );


                // ==========================
                // DM USER
                // ==========================

                await message.author.send({

                    content:

                        "🚫 You are not allowed to send messages in this channel.\n\n" +

                        "You have been banned from the server."

                })

                    .catch(

                        () => {}

                    );


                // ==========================
                // BAN USER
                // ==========================

                await message.member.ban({

                    reason:

                        "Ban Trap Triggered",

                    deleteMessageSeconds:

                        604800

                })

                    .catch(

                        () => {}

                    );


                // ==========================
                // BAN LOG
                // ==========================

                if (

                    trap.logs

                ) {


                    const logChannel =

                        message.guild.channels.cache.get(

                            trap.logs

                        );


                    if (

                        logChannel

                    ) {


                        const embed =

                            new EmbedBuilder()

                                .setColor(

                                    "Red"

                                )

                                .setTitle(

                                    "🚨 Ban Trap Triggered"

                                )

                                .setDescription(

                                    `👤 User:
${message.author}

🆔 ID:
${message.author.id}

📍 Channel:
${message.channel}

🗑️ Messages Deleted:
Last 7 days

⚠️ Reason:
Sent a message in the ban trap channel.`

                                )

                                .setTimestamp();


                        await logChannel.send({

                            embeds: [

                                embed

                            ]

                        })

                            .catch(

                                () => {}

                            );

                    }

                }


                return;

            }

        }


        // ==================================================
        // ANTI INVITE
        // ==================================================

        const antiInvite =

            settings[

                message.guild.id

            ]?.antiInvite ??

            false;


        if (

            antiInvite

        ) {


            const inviteRegex =

                /(discord\.gg\/|discord\.com\/invite\/|discordapp\.com\/invite\/)/i;


            if (

                inviteRegex.test(

                    message.content

                )

            ) {


                const isAdmin =

                    message.member.permissions.has(

                        PermissionFlagsBits.Administrator

                    );


                const canManageMessages =

                    message.member.permissions.has(

                        PermissionFlagsBits.ManageMessages

                    );


                if (

                    !isAdmin &&

                    !canManageMessages

                ) {


                    await message.delete()

                        .catch(

                            () => {}

                        );


                    const warning =

                        await message.channel.send({

                            content:

                                `🚫 ${message.author}, Discord invites are not allowed here.`

                        });


                    setTimeout(

                        () => {

                            warning.delete()

                                .catch(

                                    () => {}

                                );

                        },

                        5000

                    );


                    return;

                }

            }

        }


        // ==================================================
        // LOAD RANK CONFIG
        // ==================================================

        let rankConfig = {

            ignoredChannels: []

        };


        if (

            fs.existsSync(

                rankConfigPath

            )

        ) {

            try {

                rankConfig = JSON.parse(

                    fs.readFileSync(

                        rankConfigPath,

                        "utf8"

                    )

                );

            } catch (error) {

                console.error(

                    "❌ Failed to load rankconfig.json:",

                    error

                );

            }

        }


        // ==================================================
        // IGNORED CHANNELS
        // ==================================================

        if (

            rankConfig.ignoredChannels.includes(

                message.channel.id

            )

        ) {

            return;

        }


        // ==================================================
        // XP COOLDOWN
        // ==================================================

        if (

            cooldowns.has(

                message.author.id

            )

        ) {

            return;

        }


        cooldowns.add(

            message.author.id

        );


        setTimeout(

            () => {

                cooldowns.delete(

                    message.author.id

                );

            },

            10000

        );


        // ==================================================
        // LOAD LEVELS
        // ==================================================

        let levels = {};


        if (

            fs.existsSync(

                levelsPath

            )

        ) {

            try {

                levels = JSON.parse(

                    fs.readFileSync(

                        levelsPath,

                        "utf8"

                    )

                );

            } catch (error) {

                console.error(

                    "❌ Failed to load levels.json:",

                    error

                );

            }

        }


        // ==================================================
        // CREATE USER DATA
        // ==================================================

        if (

            !levels[

                message.author.id

            ]

        ) {

            levels[

                message.author.id

            ] = {

                xp: 0,

                level: 1

            };

        }


        const user =

            levels[

                message.author.id

            ];


        // ==================================================
        // MAX LEVEL
        // ==================================================

        if (

            user.level >= 100

        ) {

            return;

        }


        // ==================================================
        // GIVE XP
        // ==================================================

        user.xp += 10;


        const needed =

            1000 +

            (

                (

                    user.level - 1

                )

                *

                250

            );


        // ==================================================
        // LEVEL UP
        // ==================================================

        if (

            user.xp >=

            needed

        ) {


            user.xp -=

                needed;


            user.level++;


            const nextNeeded =

                1000 +

                (

                    (

                        user.level - 1

                    )

                    *

                    250

                );


            const embed =

                new EmbedBuilder()

                    .setColor(

                        "#a020f0"

                    )

                    .setTitle(

                        "🎉 Rank Up!"

                    )

                    .setDescription(

                        `Congratulations ${message.author}!

⭐ Level:
**${user.level}**

✨ XP:
${user.xp}/${nextNeeded}`

                    )

                    .setThumbnail(

                        message.author.displayAvatarURL()

                    )

                    .setTimestamp();


            await message.channel.send({

                content:

                    `${message.author}`,

                embeds: [

                    embed

                ]

            });

        }


        // ==================================================
        // SAVE LEVELS
        // ==================================================

        try {

            fs.writeFileSync(

                levelsPath,

                JSON.stringify(

                    levels,

                    null,

                    4

                )

            );

        } catch (error) {

            console.error(

                "❌ Failed to save levels.json:",

                error

            );

        }

    }

};