const {
    SlashCommandBuilder,
    PermissionsBitField
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const shopPath =
path.join(
    __dirname,
    "../data/roleShop.json"
);





function loadShop(){


    if(!fs.existsSync("./data")){


        fs.mkdirSync("./data");


    }





    if(!fs.existsSync(shopPath)){



        fs.writeFileSync(


            shopPath,


            JSON.stringify(


                {

                    roles:{}

                },


                null,

                4


            )


        );


    }







    return JSON.parse(


        fs.readFileSync(


            shopPath,


            "utf8"


        )


    );


}








function saveShop(data){



    fs.writeFileSync(



        shopPath,



        JSON.stringify(



            data,



            null,



            4



        )



    );


}









module.exports = {



data:

new SlashCommandBuilder()



.setName("setrole")



.setDescription(

    "Create or update a role shop item"

)



.setDefaultMemberPermissions(



    PermissionsBitField.Flags.Administrator



)







.addRoleOption(option =>



    option



    .setName("role")



    .setDescription(

        "Role players can buy"

    )



    .setRequired(true)



)








.addIntegerOption(option =>



    option



    .setName("moneycost")



    .setDescription(

        "Price in coins"

    )



    .setRequired(true)



)








.addIntegerOption(option =>



    option



    .setName("limit")



    .setDescription(

        "Maximum amount sold"

    )



    .setRequired(true)



),











async execute(interaction){





    const role =

    interaction.options.getRole("role");





    const cost =

    interaction.options.getInteger("moneycost");





    const limit =

    interaction.options.getInteger("limit");









    if(cost <= 0){



        return interaction.reply({



            content:

            "❌ Price must be above 0 coins.",



            ephemeral:true



        });



    }








    if(limit <= 0){



        return interaction.reply({



            content:

            "❌ Limit must be above 0.",



            ephemeral:true



        });



    }









    const shop =

    loadShop();









    const alreadyExists =

    shop.roles[role.id];









    shop.roles[role.id] = {



        cost:cost,



        limit:limit,



        sold:

        alreadyExists?.sold || 0



    };









    saveShop(shop);









    await interaction.reply({



        content:



        `✅ ${role} added to the shop!\n\n` +



        `💰 Price: **${cost.toLocaleString()} Coins**\n` +



        `📦 Stock: **${limit}**`,



        ephemeral:true



    });





}



};