const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");


const {
    getPlayer
} = require("../music/manager");



module.exports = {


data:

new SlashCommandBuilder()

.setName("play")

.setDescription("Search for a song")

.addStringOption(option =>

    option

    .setName("song")

    .setDescription("Song name or URL")

    .setRequired(true)

),



async execute(interaction){



    console.log(
        "[DEBUG] /play used by",
        interaction.user.tag
    );



    const player =
    getPlayer();



    if(!player){

        return interaction.reply({

            content:
            "❌ Music system not ready.",

            ephemeral:true

        });

    }




    await interaction.deferReply();



    const query =

    interaction.options.getString("song");




    try {



        const result =

        await player.search(

            query,

            {

                requestedBy:
                interaction.user

            }

        );



        if(!result.hasTracks()){


            return interaction.editReply({

                content:
                "❌ No songs found."

            });


        }




        const tracks =

        result.tracks.slice(0,5);




        if(!interaction.client.musicSearches){

            interaction.client.musicSearches =
            new Map();

        }



        interaction.client.musicSearches.set(

            interaction.user.id,

            tracks

        );




        const menu =

        new StringSelectMenuBuilder()

        .setCustomId(
            "music_select"
        )

        .setPlaceholder(
            "🎵 Select a song"
        )

        .addOptions(

            tracks.map(

                (track,index)=>({

                    label:
                    track.title.substring(0,100),

                    description:
                    track.author?.substring(0,100)
                    || "Unknown",

                    value:
                    String(index)

                })

            )

        );



        const row =

        new ActionRowBuilder()

        .addComponents(
            menu
        );




        await interaction.editReply({

            content:
            "🎵 Choose a song:",

            components:[row]

        });



    } catch(error){


        console.error(
            "[SEARCH ERROR]",
            error
        );



        await interaction.editReply({

            content:
            "❌ Search failed."

        });


    }


}


};