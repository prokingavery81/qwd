const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("queue")

        .setDescription("Show the current music queue"),



    async execute(interaction) {


        const player = getPlayer();



        if (!player) {

            return interaction.reply({

                content:
                "❌ Music system is not loaded.",

                ephemeral:true

            });

        }



        const queue = player.nodes.get(

            interaction.guild.id

        );



        if (!queue || !queue.currentTrack) {

            return interaction.reply({

                content:
                "❌ Nothing is playing.",

                ephemeral:true

            });

        }



        let songs = queue.tracks.toArray();



        let list = songs.length

            ? songs
                .slice(0,10)
                .map((song,index)=>
                    `${index + 1}. ${song.title}`
                )
                .join("\n")

            : "No songs waiting.";



        const embed = new EmbedBuilder()

            .setTitle("🎵 Music Queue")

            .setDescription(

                `▶️ **Now Playing:**\n${queue.currentTrack.title}\n\n` +

                `📜 **Up Next:**\n${list}`

            )

            .setColor("Purple");



        await interaction.reply({

            embeds:[embed]

        });


    }


};