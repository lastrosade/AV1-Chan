'use strict'

// Import the discord.js module
const fs = require('fs');
// const https = require('https');
// const path = require('path');
// const sleep = require('sleep');
// const brain = require('brain.js');
// const { exec } = require("child_process");

// DB
let JsonDB = require('node-json-db').JsonDB;
let Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
var db = new JsonDB(new Config("DB", false, false, '/'));
let db_change = false;

let homoglyphSearch = require('homoglyph-search');

// const crypto = require('crypto');

// Create an instance of discord that we will use to control the bot
const discord = require('discord.js');
const bot = new discord.Client();
// const rich = new discord.RichEmbed();

const moment = require('moment');
process.env.TZ = 'Europe/London'

// Is the bot currently in a voice channel ?
// let bot_is_locked = false;

// Token for your bot, located in the discord application console - https://discordapp.com/developers/applications/me/
const token = fs.readFileSync('bot-token.txt', "ascii");

// const humanFileSize = (size) => {
//     return size;
// }

class AV1Chan {
    constructor(params) {
        
    }

    unknownArg(string) {
        if (string != undefined)
            return "Uknown: '"+string+"'";
        return this.notenoughArgs()
    }

    notenoughArgs() {
        return "Not enough arguments.";
    }

    man(string) {
        if (string == undefined) {
            const default_help = "AV1-Chan:\n"
            + "`!man <command>`\nGet help with <command>\n"
            + "`!time`\nGet UTC time\n"
            + "\n"
            + "Available modules:\n"
            + "**croc** -- A local filehosting thing using croc. `!croc help` for more info.\n"
            + ""
            return default_help;
        }
            

        switch (string) {
            case "man":
            case "help":
                return "`!man <command>`\nGet help with <command>";
            case "time":
                return "`!time`\nGet UTC time"
            case "croc":
                const croc_help = "AV1-Chan **croc** module:\n"
                + "\n**KEEP IN MINDE THIS HAS YET TO BE IMPLEMENTED**\n\n"
                + "`!croc up <file-croc-code> [time]`\n"
                + "Start downloading a file with croc and inform of the success. ether failure or success with crc32.\n"
                + "[time] is optional, will accept minutes, hours and days (eg. 10m; 30h; 2d).\n"
                + "\n"
                + "`!croc down <crc32>`\n"
                + "Generate croc code and PM it to you for you to download the file.\n"
                + "\n"
                + "`!croc show <crc32>`\n"
                + "Gives info on the file.\n"
                + "\n"
                + "`!croc list [userid]`\n"
                + "Lists files [userid] uploaded, will show your files if no user specified. Its the USERID don't ping anyone you troglodytes.\n"
                + "\n"
                + "`!croc users`\n"
                + "Lists users who uploaded a file and their userid.\n"
                + "\n"
                + "`!croc remove <crc32>`\n"
                + "Removes a file.\n"
                + "\n"
                + "`!croc help`\n"
                + "`!man croc`\n"
                + "Prints help.\n";
                return croc_help;
            default:
                return this.unknownArg(string)
        }
    }
}
const Chan = new AV1Chan

// const helpmsg = "I scan files.\nTo scan a file: upload it with the message '!scan' or 'scan', it **has** to be a single message.\nI only scan \`mkv, mka, mks, mk3d, webm, ogv, oga, ogg, opus, ivf, h261, h263, 264, h264, 265, h265, hevc, vc1, vc2, y4m, dv, dif, avi, ffm, mov, flv, f4v, swf, flac, alac, nut, asf, ac3, eac3, a52, spdif, rm, aac, hds, ismv, isma, latm, sap, wv, tta, ape, wav, aiff, truehd, smjpeg, sox, adx, daud, au, dts, ast, caf, gxf, ircam, mmf, mxf, alaw, mulaw, roq, thd, voc, w64, adts, amr, ilbc, c2, bit, speex, spx, aptx, aptxhd, sbc, msbc, mpeg, mp2, m2t, m2ts, mts, ts, hls, mpegts, mp3, mp4, m4v, m4a, m4b, mpd, avm2, dvd, vob, vcd, svcd, ipod, psp, 3g2, 3gp, webp, jpg, jpeg, mjpg, mjpeg, png, apng, jp2, j2k, jpf, jpx, jpm, mj2, pbm, pgm, ppm, bmp, gif\`\nPlease do not use me for spam (ie don't scan memes and trash), Be respectful, Thanks.";

// Gets called when our bot is successfully logged in and connected
// bot.on('ready', () => {
//     console.log('Hello World!');
//     bot.user.setActivity(`since ${moment().format("DD-MM-YY HH:mm")}`);
// });

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {

    db.reload();
    db_change = false

    // So the bot doesn't reply to iteself
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong!');
        return;
    }

    const msg_lower = message.content.toLowerCase();
    // const first_word = msg_lower.substr(0, msg_lower.indexOf(" ")); // empty if there is only one word

    // Handle commands
    // if (msg_lower[0] === "!") {
        // message.channel.send("stfu");
        // let com = msg_lower.split(" ")
        // console.log(0, com);
        // switch (com[0]) {

        //     case "!man":
        //     case "!help":
        //         message.channel.send(Chan.man(com[1]));
        //         break;

        //     case "!time":
        //         message.channel.send(`UTC Time is ${moment().format("HH:mm")}`);
        //         break;

        //     case "!croc":
        //         com.shift();
        //         if (com.length > 1) {
        //             message.channel.send(Chan.notenoughArgs());
        //         }
        //         console.log(1, com);
        //         switch (com[0]) {
        //             case "man":
        //             case "help":
        //                 message.channel.send(Chan.man("croc"));
        //                 return;

        //             case "up":
        //                 return;
                
        //             default:
        //                 message.channel.send("Croc module, has yet to be implemented.");
        //                 // message.channel.send(Chan.unknownArg(com[0]));
        //                 return;
        //         }
        //     default:
        //         message.channel.send(Chan.unknownArg(com[0]));
        //         return;
        // }

    // }

    const msg_fmt_1 = msg_lower.replace(/\s/g, '').replace(/\<[^\>]*>/g, "");
    if (homoglyphSearch.search(msg_fmt_1, ["hentai"]).length > 0 ||
        homoglyphSearch.search(msg_fmt_1, ["hentie"]).length > 0) {
        let hentai = db.getData("/counters/hentai_counter")+1;
        db.push("/counters/hentai_counter", hentai); 
        db_change = true;
        message.channel.send('<@551696650826153995>, '+hentai);
    }
    
    if (homoglyphSearch.search(msg_fmt_1, ["jeremylee.sh"]).length > 0) {
        let jeremyleesh = db.getData("/counters/jeremyleesh_counter")+1; 
        db.push("/counters/jeremyleesh_counter", jeremyleesh); 
        db_change = true;
    }

    if (homoglyphSearch.search(msg_fmt_1, ["av1an"]).length > 0) {
        let av1an = db.getData("/counters/av1an_counter")+1; 
        db.push("/counters/av1an_counter", av1an); 
        db_change = true;
        // message.channel.send('<@258670228819410944>, '+av1an);
    }

    if (homoglyphSearch.search(msg_fmt_1, ["h265"]).length > 0 ||
        homoglyphSearch.search(msg_fmt_1, ["h264"]).length > 0 ||
        homoglyphSearch.search(msg_fmt_1, ["aac"]).length > 0 ||
        homoglyphSearch.search(msg_fmt_1, ["divx"]).length > 0 ||
        homoglyphSearch.search(msg_fmt_1, ["mp3"]).length > 0) {
        if (Math.random() * 100 > 85 ) {
            message.channel.send('Cursed');
        }
    } else if (homoglyphSearch.search(msg_fmt_1, ["opus"]).length > 0) {
        if (Math.floor(Math.random() * 100) > 86 ) {
            message.channel.send(':b:opus');
        }
    }

    if (homoglyphSearch.search(msg_fmt_1, ["food"]).length > 0 && message.author.id == "132637059327328256") {
        message.channel.send('Yes');
    }

    if (db_change) {
        db.save();
        db_change = false;
    }
});

bot.login(token);
