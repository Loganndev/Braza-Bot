// Importa as instâncias necessárias.
const Discord = require("discord.js");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_INVITES]})
const config = require('./config.json')
// Cria uma nova instância  chama client.
const darkList = []
const badWords = ["piranha","babaca","puta","puto","arrombado","fdp","desgraçado","desgracado","desgraçada","desgracada"];

function CreateWarn(user){
    this.user = user;
    this.warns = 0;
}
let warns = 0;

client.on("ready",() => client.user.setActivity("Apenas um bot da Braza :)"))

client.on("message",message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    if(message.content == client.user || message.content == "!help"){
        message.channel.send("```Help\n!listanegra => Exibe todos os usuários que estão na lista negra (apenas para ADMs).\n\n!listanegrakick => Kicka todos usuários da lista negra do servidor. \n\n!ping => Exibe a latência do bot e da API```")
    }
    if (message.content == "!listanegrakick"){
        if(message.member.permissions.has("ADMINISTRATOR")){
            for(let u of darkList){
               u.member.kick("Você desrespeitou as regras e foi parar na lista negra!")
            }
        }
        else{
            message.channel.send("Você não tem permissão para usar este comando.")
        }
        for(let u of darkList){
            u.member.kick("Você estava na lista negra.")
        }
    }
    if(message.content == "!ping"){
        message.channel.send(`Pong!\n**Latência:** ${message.createdTimestamp}ms.\n**Latência da API :**  ${Math.round(client.ws.ping)}ms`)
    }
    // Exibir lista negra:
    if(message.content == "!listanegra") {
        if(message.member.permissions.has("ADMINISTRATOR")){
            if(darkList.length === 0){
                message.channel.send(`Não há pessoas na lista negra.`)
                return;
        }
            else{
                message.channel.send(`Pessoas na lista negra: ${darkList.join(",")}`)
            }

    }
        else{
          message.channel.send("Você não tem permissão para usar esse comando.")
        }

    }
    
    // Sistema anti-palavrão
    for(let w of badWords){
        if(message.content.toLowerCase().includes(w)) {
            message.delete()
            if(warns === 0 || warns === 1) {
                message.author.send("Por favor,não mandes esse tipo de palavriado na nossa comunidade! ")
                warns = 2;
                return;
            }
    
            if(warns === 2){
                
                message.author.send("Caso você mande novamente ,será punido!")
                warns++;
                return;
            }

            if(warns > 2) {
                for(let u of darkList){
                    if(u == message.member) return;
                }
                darkList.unshift(message.member);
                message.guild.channels.cache.get("954195138274537534").send(`O Usuário ${message.member.user} foi adicionado para a lista negra.`);
                warns = 0;

                return;
            }
       }
    }
});
client.on("inviteCreate", invite => {
    return invite.guild.channels.cache.get("959900971176185940").send(`O usuário ${invite.inviter.username} criou um convite. \nCódigo do convite: ${invite.code}\nURL do convite: ${invite.url}`);
    
})
client.on("guildMemberAdd",member => {
    return member.guild.channels.cache.get("952340014157660250").send(`Olá, ${member.user}, seja bem-vindo a nossa comunidade SCP. De uma passada no canal https://discord.com/channels/950570132239949904/951988056024547388, se registre no canal https://discord.com/channels/950570132239949904/964223357233008640 e converse no https://discord.com/channels/950570132239949904/965719695535788072.`)

})


client.login(config.token)

