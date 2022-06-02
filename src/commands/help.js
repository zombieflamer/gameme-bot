const config = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands/info about a specific command.",
  aliases: ["h"], 
  usage: " ", 
  cooldown: 5, 
  guildOnly: false,
  admin: false,
  async execute(message, args, client) {    
    let prefix = config.prefix
    const embed = new Discord.MessageEmbed()
    .setTitle(`Commands:`)
    .addFields(
      { name: `${prefix}help`, value: `Shows all the commands you can use!` },
      { name: `${prefix}sinfo`, value: `To display information about a server, usage: ${prefix}sinfo <server>` },
      { name: `${prefix}pinfo`, value: `To display information about a player, usage: ${prefix}pinfo <steamid> <server>` },
      { name: `${prefix}top`, value: `To display the Top 40 players in the server!, usage: ${prefix}top <server>` },
    )
    .setColor(config.embedColor)
    .setTimestamp()
    .setFooter('Servers are: zr, dm, de');
    message.channel.send(embed)
  }
}