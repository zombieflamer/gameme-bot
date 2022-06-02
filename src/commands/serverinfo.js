const Discord = require("discord.js");
const fetch = require('node-fetch');
const xml_to_js = require('xml-js');
const Converter = require('timestamp-conv');
const { flag } = require('country-emoji');
const config = require("../config.json");

module.exports = {
	name: 'sinfo',
	description: 'show server info',
	aliases: [''],
	usage: ' ',
	cooldown: 5,
	guildOnly: false,
	admin: false,
	async execute(message, args, client) {
        if (!args[0]) return message.channel.send('You must provide a server name!!\nDeathmatch: **dm**\nZombie Revive: **zr**\nPublic dd2: **de**')
        const arg = args.slice(0).join(" ")

            let query;
        
            if (arg == "dm"){
                query = `${config.serverslist.dm}`.replace(' dm','')
            } else if (arg == "zr"){
                query = `${config.serverslist.zr}`.replace(' zr','')
            } else if (arg == "de"){
                query = `${config.serverslist.de}`.replace(' de','')
            } else {
                message.channel.send("There is no server with this name!!\nDeathmatch: **dm**\nZombie Revive: **zr**\nPublic dd2: **de**")
            }

        fetch(query, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/xml',
                'User-Agent': '*',
            },
        })
        .then(function(response){ return response.text(); })
        .then(function(xml){
            var json_result = xml_to_js.xml2json(xml, {compact: true, spaces: 4})
            var obj = JSON.parse(json_result);
            const server = obj.gameME.serverlist.server
            const totalTime = server.uptime._text
            const timer = new Converter.date(server.time._text);
            function secondsToHms(totalTime) {
                totalTime = Number(totalTime);
                var h = Math.floor(totalTime / 3600);
                var m = Math.floor(totalTime % 3600 / 60);
                var s = Math.floor(totalTime % 3600 % 60);
            
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                return hDisplay + mDisplay + sDisplay; 
            }
            function getimage(imageMap){
                for (let i = 0; i < imageMap.length; i++) {
                    if (imageMap === true) {
                        return imageMap
                    }
                 }
            }

            const embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .addField(`Server:`,`[${server.name._text}](http://stats.zombieflamer.com/)`)
            .addField(`ID:`, `${server.id._text}`, true)
            .addField(`IP:`, `${server.addr._text}:${server.port._text}`, true)
            .addField(`Country:`, `${flag("fr")} France`, true)
            .addField(`Map started at:`, `${timer.getDay()}/${timer.getMonth()}/${timer.getYear()}, ${timer.getHour()}:${timer.getMinute()}`, true)
            .addField(`Uptime:`, `${secondsToHms(totalTime)}`, true)
            .addField(`Map:`, `${server.map._text}`, true)
            .addField(`Players:`, `${server.act._text}(${server.bots._text})/${server.max._text}`, true)
            message.channel.send(embed)
        }).catch(e => {console.log(e)});
  }
} 