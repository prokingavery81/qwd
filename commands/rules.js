const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("rules")

        .setDescription("Send the Ascension SMP Discord rules"),



    async execute(interaction) {


        const embed = new EmbedBuilder()

        .setColor("#a020f0")

        .setTitle("📜 Ascension SMP Discord Rules")

        .setDescription(
`
Welcome to **Ascension SMP**! Please follow these rules to keep the community fun and friendly.

`)

        .addFields(

            {
                name: "1️⃣ Respect Everyone",
                value:
                "Treat all members with respect. No harassment, bullying, racism, discrimination, or unnecessary arguments."
            },

            {
                name: "2️⃣ No Spam",
                value:
                "Do not spam messages, emojis, mentions, or commands. Keep chats readable."
            },

            {
                name: "3️⃣ No Advertising",
                value:
                "Do not advertise other servers, Discords, or services without permission from staff."
            },

            {
                name: "4️⃣ Use Channels Correctly",
                value:
                "Keep conversations in the correct channels and follow channel purposes."
            },

            {
                name: "5️⃣ No NSFW Content",
                value:
                "Any inappropriate, NSFW, or unsafe content is not allowed."
            },

            {
                name: "6️⃣ No Cheating / Exploiting",
                value:
                "Do not use cheats, hacks, exploits, or abuse bugs on Ascension SMP."
            },

            {
                name: "7️⃣ Listen To Staff",
                value:
                "Staff decisions must be respected. If you disagree, calmly contact a higher staff member on the discord."
            },

            {
                name: "8️⃣ Have Fun",
                value:
                "Enjoy the community, make friends, and help make Ascension SMP a great place!"
            }

        )

        .setFooter({
            text:
            "Ascension SMP • Follow the rules and enjoy your adventure!"
        })

        .setTimestamp();



        await interaction.reply({

            embeds:[
                embed
            ]

        });


    }

};