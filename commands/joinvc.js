const {
    SlashCommandBuilder
} = require("discord.js");

const {
    joinVoiceChannel
} = require("@discordjs/voice");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("joinvc")

        .setDescription("Join your current voice channel"),


    async execute(interaction) {


        console.log("[DEBUG] /joinvc used by", interaction.user.tag);



        const voiceChannel =
        interaction.member.voice.channel;



        if (!voiceChannel) {


            console.log(
                "[DEBUG] User is not in a voice channel"
            );


            return interaction.reply({

                content:
                "❌ You need to join a voice channel first.",

                ephemeral: true

            });


        }



        try {


            joinVoiceChannel({

                channelId:
                voiceChannel.id,


                guildId:
                interaction.guild.id,


                adapterCreator:
                interaction.guild.voiceAdapterCreator,


                selfDeaf:false


            });



            console.log(
                "[DEBUG] Joined:",
                voiceChannel.name
            );



            await interaction.reply({

                content:
                `🎵 Joined **${voiceChannel.name}**`

            });



        } catch(error) {


            console.error(
                "[JOIN VC ERROR]",
                error
            );



            await interaction.reply({

                content:
                "❌ Failed to join the voice channel.",

                ephemeral:true

            });


        }


    }


};