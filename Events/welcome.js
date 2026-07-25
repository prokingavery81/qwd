const {
    Events,
    ChannelType,
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const fs = require("fs");


async function createWelcomeImage(member) {

    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext("2d");


    ctx.fillStyle = "#140025";
    ctx.fillRect(0, 0, 1000, 400);


    ctx.textAlign = "center";


    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Arial";

    ctx.fillText(
        "WELCOME TO",
        500,
        90
    );


    ctx.fillStyle = "#a020f0";

    ctx.fillText(
        "ASCENSION SMP",
        500,
        160
    );


    const avatar =
    await loadImage(
        member.user.displayAvatarURL({
            extension: "png",
            size: 256
        })
    );


    ctx.save();

    ctx.beginPath();

    ctx.arc(
        500,
        260,
        80,
        0,
        Math.PI * 2
    );

    ctx.closePath();

    ctx.clip();


    ctx.drawImage(
        avatar,
        420,
        180,
        160,
        160
    );


    ctx.restore();


    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 35px Arial";

    ctx.fillText(
        member.user.username,
        500,
        380
    );


    return new AttachmentBuilder(
    canvas.toBuffer("image/png"),
    {
        name:"welcome.png"
    }
);

}



module.exports = {

    name: Events.GuildMemberAdd,


    async execute(member) {


        console.log(
            `[DEBUG] guildMemberAdd fired for ${member.user.tag}`
        );


        // ==========================
        // AUTOROLE
        // ==========================

        if (fs.existsSync("./autorole.json")) {


            console.log(
                "[DEBUG] autorole.json found"
            );


            const data = JSON.parse(
                fs.readFileSync(
                    "./autorole.json",
                    "utf8"
                )
            );


            const roleId =
            data[member.guild.id];


            console.log(
                "[DEBUG] Saved role:",
                roleId
            );


            if (roleId) {


                const role =
                member.guild.roles.cache.get(roleId);


                if (role) {


                    console.log(
                        "[DEBUG] Role found:",
                        role.name
                    );


                    const botRole =
                    member.guild.members.me.roles.highest;



                    if (role.position < botRole.position) {


                        console.log(
                            "[DEBUG] Adding autorole..."
                        );


                        await member.roles.add(role)
                        .then(() => {

                            console.log(
                                `[DEBUG] Autorole given to ${member.user.tag}`
                            );

                        })
                        .catch(error => {

                            console.error(
                                "[DEBUG] Autorole error:",
                                error
                            );

                        });


                    } else {


                        console.log(
                            "[DEBUG] Cannot give role - role is above bot"
                        );


                    }


                } else {


                    console.log(
                        "[DEBUG] Role not found"
                    );


                }


            } else {


                console.log(
                    "[DEBUG] No autorole set for this server"
                );


            }


        } else {


            console.log(
                "[DEBUG] autorole.json does not exist"
            );


        }



        // ==========================
        // WELCOME MESSAGE
        // ==========================


        const welcomeChannel =
        member.guild.channels.cache.find(
            channel =>
            channel.type === ChannelType.GuildText &&
            channel.name.toLowerCase().includes("welcome")
        );


        if (!welcomeChannel) {

            console.log(
                "[DEBUG] Welcome channel not found"
            );

            return;

        }



        const image =
        await createWelcomeImage(member);



        const embed =
        new EmbedBuilder()

        .setColor("#a020f0")

        .setTitle(
            "🌟 Welcome to Ascension SMP!"
        )

        .setDescription(
`
Welcome ${member}!

⚔️ **Lifesteal**

Steal hearts from players and become stronger.

🌪️ **Elements**

Unlock powerful elemental abilities and master your powers.

🔥 Explore, battle, and rise to the top!

📜 Make sure to read the rules.
`
        )

        .setImage(
            "attachment://welcome.png"
        )

        .setTimestamp();



        await welcomeChannel.send({

            content:
            `🎉 Welcome ${member}!`,

            embeds: [
                embed
            ],

            files: [
                image
            ]

        });


        console.log(
            `[DEBUG] Welcome sent for ${member.user.tag}`
        );


    }

};