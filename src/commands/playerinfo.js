const Discord = require("discord.js");
const fetch = require('node-fetch');
const xml_to_js = require('xml-js');
const Converter = require('timestamp-conv');
const { flag } = require('country-emoji');
const config = require("../config.json");

module.exports = {
	name: 'pinfo',
	description: 'show player rank',
	aliases: [''],
	usage: ' ',
	cooldown: 5,
	guildOnly: false,
	admin: false,
	async execute(message, args, client) {
        if (!args[0]) return message.channel.send('You must provide a player steamid!')
        if (!args[1]) return message.channel.send('You must provide a server name!!\nDeathmatch: **dm**\nZombie Revive: **zr**\nPublic dd2: **de**')
        const steamid = args.slice(0).join(" ")
        const server = args.slice(1).join(" ")

        if (steamid.startsWith("STEAM")){
            let query;
            if (server == "dm"){
                query = `${config.playersinfo.dm}/${steamid}`.replace(' dm','')
            } else if (server == "zr"){
                query = `${config.playersinfo.zr}/${steamid}`.replace(' zr','')
            } else if (server == "de"){
                query = `${config.playersinfo.de}/${steamid}`.replace(' de','')
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
            var json_result = xml_to_js.xml2json(xml, {compact: true, spaces: 4});
            var obj = JSON.parse(json_result);
            console.log(json_result)
            const player = obj.gameME.playerinfo.player
            const FirstDate = new Converter.date(player.firstconnect._text);
            const LastDate = new Converter.date(player.lastconnect._text);
            const totalTime = player.time._text
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

            let player_name;
            let player_clan_tag;

            if (player.name._text == undefined){
                player_name = player.name._cdata
            } else {
                player_name = player.name._text
            }
            
            if (player.clantag._text == undefined){
                player_clan_tag = player.clantag._cdata
            } else {
                player_clan_tag = player.clantag._text
            }

            const embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setThumbnail(`${player.avatar._cdata}`, true)
            .addField(`Name:`,`[${player_name}](http://stats.zombieflamer.com/playerinfo/${player.id._text})`)
            .addField(`ID:`, `${player.id._text}`, true)
            .addField(`Country:`, `${flag(player.cc._text)} ${player.cn._text}`, true)
            .addField(`Clan Tag:`, `${player_clan_tag}`)
            .addField(`Activity:`, `${player.activity._text}`, true)
            .addField(`Rank:`, `${player.rank._text}`, true)
            .addField(`Skill:`, `${player.skill._text}`, true)
            .addField(`Kills:`, `${player.kills._text}`, true)
            .addField(`Deaths:`, `${player.deaths._text}`, true)
            .addField(`Headshots:`, `${player.hs._text}`, true)
            .addField('Suicides:', `${player.suicides._text}`, true)
            .addField(`Shots:`, `${player.shots._text}`, true)
            .addField(`Hits:`, `${player.hits._text}`, true)
            .addField(`Headshots:`, `${player.hs._text}`, true)
            .addField(`First connect:`, `${FirstDate.getDay()}/${FirstDate.getMonth()}/${FirstDate.getYear()}, ${FirstDate.getHour()}:${FirstDate.getMinute()}`, true)
            .addField(`Last connect:`, `${LastDate.getDay()}/${LastDate.getMonth()}/${LastDate.getYear()}, ${LastDate.getHour()}:${LastDate.getMinute()}`, true)
            .addField(`Total time:`, `${secondsToHms(totalTime)}`)
            .addField(`Total connects:`, `${player.totalconnects._text}`, true)
            message.channel.send(embed)
        }).catch(e => {console.log(e)});
    } else {
        message.channel.send('Please provide a valid steamid! Example: **STEAM_0:1:123456789**')
    }
  }
}