const {
    AuditLogEvent
} = require("discord.js");

const fs = require("fs");


const path = "./data/settings.json";



module.exports = {


    name: "ready",



    async execute(client) {



        console.log(
            "🛡️ Anti-Nuke system loaded"
        );





        client.on(

            "guildAuditLogEntryCreate",

            async (entry, guild) => {



                try {



                    if(
                        !fs.existsSync(path)
                    )
                        return;






                    const settings = JSON.parse(

                        fs.readFileSync(
                            path,
                            "utf8"
                        )

                    );







                    if(
                        !settings[guild.id]?.antiNuke
                    )
                        return;








                    const executor =

                    await guild.members.fetch(
                        entry.executorId
                    )
                    .catch(()=>null);







                    if(!executor)
                        return;







                    // Ignore owner

                    if(
                        executor.id === guild.ownerId
                    )
                        return;









                    let triggered = false;

                    let reason = "";









                    // Channel delete


                    if(

                        entry.action ===
                        AuditLogEvent.ChannelDelete

                    ){


                        triggered = true;

                        reason =
                        "Deleting channels";


                    }








                    // Role delete


                    if(

                        entry.action ===
                        AuditLogEvent.RoleDelete

                    ){


                        triggered = true;

                        reason =
                        "Deleting roles";


                    }








                    // Mass bans


                    if(

                        entry.action ===
                        AuditLogEvent.MemberBanAdd

                    ){


                        triggered = true;

                        reason =
                        "Mass banning members";


                    }








                    // Mass kicks


                    if(

                        entry.action ===
                        AuditLogEvent.MemberKick

                    ){


                        triggered = true;

                        reason =
                        "Mass kicking members";


                    }








                    // Adding bots


                    if(

                        entry.action ===
                        AuditLogEvent.BotAdd

                    ){


                        triggered = true;

                        reason =
                        "Adding bots";


                    }









                    if(!triggered)
                        return;









                    console.log(

                        `🚨 Anti-Nuke Triggered: ${executor.user.tag} - ${reason}`

                    );









                    // DM user


                    await executor.send({

                        content:

                        `🛡️ Anti-Nuke triggered in **${guild.name}**\n\nReason: **${reason}**\n\nYou have been kicked.`


                    })

                    .catch(()=>{});









                    // Kick user


                    await executor.kick(

                        `Anti-Nuke: ${reason}`

                    )

                    .catch(error=>{


                        console.error(

                            "Anti-Nuke kick failed:",
                            error

                        );


                    });







                }

                catch(error){


                    console.error(

                        "Anti-Nuke Error:",
                        error

                    );


                }


            }

        );


    }


};