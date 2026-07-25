require("dotenv").config();

const {
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");



const commands = [];





const commandsPath =

path.join(

    __dirname,

    "commands"

);






const commandFiles =

fs.readdirSync(commandsPath)

.filter(

    file =>

    file.endsWith(".js")

);






for(const file of commandFiles){


    const command =

    require(

        path.join(

            commandsPath,

            file

        )

    );




    if(command.data){


        commands.push(

            command.data.toJSON()

        );


        console.log(

            `Loaded: ${command.data.name}`

        );


    }


}







const rest =

new REST({

    version:"10"

})

.setToken(

    process.env.TOKEN

);






async function deploy(){



    try {



        console.log(

            `Refreshing ${commands.length} slash commands...`

        );






        await rest.put(



            Routes.applicationCommands(

                process.env.CLIENT_ID

            ),



            {

                body:commands

            }



        );







        console.log(

            "✅ Slash commands updated!"

        );





    } catch(error){



        console.error(

            "❌ Failed deploying commands:",

            error

        );


    }


}






deploy();