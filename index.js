require("dotenv").config();

const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    Events
} = require("discord.js");

const fs = require("fs");
const path = require("path");


// ==================================================
// CREATE CLIENT
// ==================================================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent,

        GatewayIntentBits.GuildVoiceStates

    ],

    partials: [

        Partials.Channel,

        Partials.Message,

        Partials.User

    ]

});


// ==================================================
// COMMAND COLLECTION
// ==================================================

client.commands = new Collection();


// ==================================================
// MUSIC SEARCH COLLECTION
// ==================================================

client.musicSearches = new Map();


// ==================================================
// LOAD COMMANDS
// ==================================================

const commandsPath = path.join(

    __dirname,

    "commands"

);


if (

    fs.existsSync(

        commandsPath

    )

) {


    const commandFiles =

        fs.readdirSync(

            commandsPath

        )

        .filter(

            file =>

                file.endsWith(

                    ".js"

                )

        );


    for (

        const file of commandFiles

    ) {


        try {


            const commandPath =

                path.join(

                    commandsPath,

                    file

                );


            const command =

                require(

                    commandPath

                );


            if (

                !command.data ||

                !command.execute

            ) {


                console.warn(

                    `⚠️ Skipped command ${file}: missing data or execute`

                );


                continue;

            }


            client.commands.set(

                command.data.name,

                command

            );


            console.log(

                `✅ Loaded command: ${command.data.name}`

            );


        } catch (error) {


            console.error(

                `❌ Failed loading command ${file}:`,

                error

            );

        }

    }


} else {


    console.warn(

        "⚠️ Commands folder not found."

    );

}


// ==================================================
// LOAD EVENTS
// ==================================================

const eventsPath = path.join(

    __dirname,

    "events"

);


if (

    fs.existsSync(

        eventsPath

    )

) {


    const eventFiles =

        fs.readdirSync(

            eventsPath

        )

        .filter(

            file =>

                file.endsWith(

                    ".js"

                )

        );


    for (

        const file of eventFiles

    ) {


        try {


            const eventPath =

                path.join(

                    eventsPath,

                    file

                );


            const event =

                require(

                    eventPath

                );


            if (

                !event.name ||

                !event.execute

            ) {


                console.warn(

                    `⚠️ Skipped event ${file}: missing name or execute`

                );


                continue;

            }


            if (

                event.once

            ) {


                client.once(

                    event.name,

                    (...args) =>

                        event.execute(

                            ...args,

                            client

                        )

                );


            } else {


                client.on(

                    event.name,

                    (...args) =>

                        event.execute(

                            ...args,

                            client

                        )

                );

            }


            console.log(

                `✅ Loaded event: ${event.name}`

            );


        } catch (error) {


            console.error(

                `❌ Failed loading event ${file}:`,

                error

            );

        }

    }


} else {


    console.warn(

        "⚠️ Events folder not found."

    );

}


// ==================================================
// GLOBAL ERROR HANDLING
// ==================================================

client.on(

    "error",

    error => {


        console.error(

            "❌ Discord client error:",

            error

        );

    }

);


process.on(

    "unhandledRejection",

    error => {


        console.error(

            "❌ Unhandled rejection:",

            error

        );

    }

);


process.on(

    "uncaughtException",

    error => {


        console.error(

            "❌ Uncaught exception:",

            error

        );

    }

);


// ==================================================
// READY
// ==================================================

client.once(

    Events.ClientReady,

    readyClient => {


        console.log(

            `🎫 ${readyClient.user.tag} is online!`

        );


        console.log(

            `📦 ${client.commands.size} commands loaded.`

        );


        console.log(

            `🎵 Music search system ready.`

        );

    }

);


// ==================================================
// LOGIN
// ==================================================

if (

    !process.env.TOKEN

) {


    console.error(

        "❌ TOKEN is missing from your .env file!"

    );


    process.exit(

        1

    );

}


client.login(

    process.env.TOKEN

)

.catch(

    error => {


        console.error(

            "❌ Login failed:",

            error

        );

    }

);