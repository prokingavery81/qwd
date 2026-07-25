const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");


let player;



async function setupPlayer(client) {


    player = new Player(client, {


        connectionTimeout: 60000,

        skipFFmpeg:false

    });



    await player.extractors.loadMulti(
        DefaultExtractors
    );



    player.events.on(
        "error",
        (queue,error)=>{

            console.error(
                "[PLAYER ERROR]",
                error
            );

        }
    );



    player.events.on(
        "playerError",
        (queue,error)=>{

            console.error(
                "[STREAM ERROR]",
                error
            );

        }
    );



    player.events.on(
        "playerStart",
        (queue,track)=>{

            console.log(
                "▶️ Playing:",
                track.title
            );

        }
    );



    console.log(
        "🎵 Discord Player loaded"
    );


    return player;

}



function getPlayer(){

    return player;

}



module.exports = {

    setupPlayer,

    getPlayer

};