# Config
Edit `src/config.json` with your links, example:
```json
{
    "token":"BOT-TOKEN-HERE",
    "prefix":"r!",
    "playersinfo": {
        "dm":"http://stats.zombieflamer.com/api/playerinfo/css3",
        "zr":"http://stats.zombieflamer.com/api/playerinfo/css2",
        "de":"http://stats.zombieflamer.com/api/playerinfo/css4"
    },
    "serverslist": {
        "dm":"http://stats.zombieflamer.com/api/serverlist/address/108.61.237.99:27015",
        "zr":"http://stats.zombieflamer.com/api/serverlist/address/108.61.122.187:27015",
        "de":"http://stats.zombieflamer.com/api/serverlist/address/108.61.122.31:27015"
    },
    "playerslist": {
        "dm":"http://stats.zombieflamer.com/api/playerlist/css3",
        "zr":"http://stats.zombieflamer.com/api/playerlist/css2",
        "de":"http://stats.zombieflamer.com/api/playerlist/css4"
    },
    "embedColor":"#00E0FF",
    "administrators":[
        "604034501210800128"
    ]
}
```
# How to run
```
npm install
node .
```
# Commands
**r!help** - Shows all the commands you can use\
**r!pinfo** - To display information about a server, usage: r!sinfo `<server>`\
**r!sinfo** - To display information about a player, usage: r!pinfo `<steamid>` `<server>`\
**r!top** - To display the Top 40 players in the server, usage: r!top `<server>`
