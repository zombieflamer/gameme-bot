const Discord = require("discord.js");
const fetch = require('node-fetch');
const xml_to_js = require('xml-js');
const config = require("../config.json");
const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'top',
	description: 'Shows top players in the server',
	aliases: [''],
	usage: ' ',
	cooldown: 5,
	guildOnly: false,
	admin: false,
	async execute(message, args, client) {
        if (!args[0]) return message.channel.send('You must provide a server name!!\nDeathmatch: **dm**\nZombie Revive: **zr**\nPublic dd2: **de**')
        const arg = args.slice(0).join(" ")

            let query;
            let which_srv;
            if (arg == "dm"){
                query = `${config.playerslist.dm}`.replace(' dm','')
                which_srv = `${config.serverslist.dm}`.replace(' dm','')
            } else if (arg == "zr"){
                query = `${config.playerslist.zr}`.replace(' zr','')
                which_srv = `${config.serverslist.zr}`.replace(' zr','')
            } else if (arg == "de"){
                query = `${config.playerslist.de}`.replace(' de','')
                which_srv = `${config.serverslist.de}`.replace(' de','')
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
            const playerlist = obj.gameME.playerlist
            const embed = new MessageEmbed()
            const embed1 = new MessageEmbed()
            const embed2 = new MessageEmbed()
            const embed3 = new MessageEmbed()
            embed3.setColor(config.embedColor)
            embed1.setColor(config.embedColor)
            embed2.setColor(config.embedColor)
            embed.setColor(config.embedColor)
            fetch(which_srv, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/xml',
                'User-Agent': '*',
            },})
            .then(function(response){ return response.text(); })
            .then(function(xml){
            var json_result = xml_to_js.xml2json(xml, {compact: true, spaces: 4})
            var obj = JSON.parse(json_result);
            server_name = obj.gameME.serverlist.server
            embed.setTitle(`${server_name.name._text}`)
            embed1.setTitle(`${server_name.name._text}`)
            embed2.setTitle(`${server_name.name._text}`)
            embed3.setTitle(`${server_name.name._text}`)
            }).catch(e => {console.log(e)});

            for(let i = 0, l = playerlist.player.length; i < l; i++) {
                
                let player_is_cdata_or_text;

                if(playerlist.player[i].name._text == undefined){
                    player_is_cdata_or_text=playerlist.player[i].name._cdata
                } else {
                    player_is_cdata_or_text=playerlist.player[i].name._text
                }
                const player_skill = playerlist.player[i].skill._text
                const player_steamid = playerlist.player[i].uniqueid._text
                const count = i+1

                        if(i <= 9) {
                    embed.addField(count +`- ${player_is_cdata_or_text} (${player_steamid})`, `Points: ${player_skill}`)
                } else if (i <= 19){
                    embed1.addField(count +`- ${player_is_cdata_or_text} (${player_steamid})`, `Points: ${player_skill}`)
                } else if (i <= 29){
                    embed2.addField(count +`- ${player_is_cdata_or_text} (${player_steamid})`, `Points: ${player_skill}`)
                } else if (i <= 39){
                    embed3.addField(count +`- ${player_is_cdata_or_text} (${player_steamid})`, `Points: ${player_skill}`)
                }
            }
            const emojiList = ["⏪", "⏩"];
            const timeout = '7200000'
            pages = [
                embed,
                embed1,
                embed2,
                embed3
            ]
            var delay = 500;
            setTimeout(function() {
                paginationEmbed(message, pages, emojiList, timeout);
            }, delay);
    }).catch(e => {console.log(e)});
}}