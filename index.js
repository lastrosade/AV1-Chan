'use strict'

// Import the discord.js module
const Discord = require('discord.js');
const fs = require('fs');
const https = require('https');
const path = require('path');
// const brain = require('brain.js');
const { exec } = require("child_process");
const moment = require('moment');

// Create an instance of Discord that we will use to control the bot
const bot = new Discord.Client();
// const rich = new Discord.RichEmbed();

process.env.TZ = 'Europe/London'

// Token for your bot, located in the Discord application console - https://discordapp.com/developers/applications/me/
const token = fs.readFileSync('bot-token.txt', "ascii");

const humanFileSize = (size) => {
    return size;
}

const helpmsg = "I scan files.\nTo scan a file: upload it with the message '!scan' or 'scan', it **has** to be a single message.\nI only scan \`mkv, mka, mks, mk3d, webm, ogv, oga, ogg, opus, ivf, h261, h263, 264, h264, 265, h265, hevc, vc1, vc2, y4m, dv, dif, avi, ffm, mov, flv, f4v, swf, flac, alac, nut, asf, ac3, eac3, a52, spdif, rm, aac, hds, ismv, isma, latm, sap, wv, tta, ape, wav, aiff, truehd, smjpeg, sox, adx, daud, au, dts, ast, caf, gxf, ircam, mmf, mxf, alaw, mulaw, roq, thd, voc, w64, adts, amr, ilbc, c2, bit, speex, spx, aptx, aptxhd, sbc, msbc, mpeg, mp2, m2t, m2ts, mts, ts, hls, mpegts, mp3, mp4, m4v, m4a, m4b, mpd, avm2, dvd, vob, vcd, svcd, ipod, psp, 3g2, 3gp, webp, jpg, jpeg, mjpg, mjpeg, png, apng, jp2, j2k, jpf, jpx, jpm, mj2, pbm, pgm, ppm, bmp, gif\`\nPlease do not use me for spam (ie don't scan memes and trash), Be respectful, Thanks.";

// Gets called when our bot is successfully logged in and connected
bot.on('ready', () => {
    console.log('Hello World!');
    bot.user.setActivity(`since ${moment().format("DD-MM-YY HH:mm")}`);

    // let vc = bot.channels.get('587033245070262279').join().then(connection => {
    //         const dispatcher = connection.playFile(path.join(__dirname, "audio", "RELENTLESS DOPPELGANGER_1.opus"), {volume: 0.15, bitrate: 48000});
    //     }).catch(err => console.log(err));

    // vc.join();
    // vc.leave();
});

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {

    // So the bot doesn't reply to iteself
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong!');
        return;
    }

    // if (message.channel.name === "av1-chan_lib")
    if (message.content.toLowerCase() === '!help') {
        message.author.send(helpmsg);
        return;
    }

    // if (message.content.toLowerCase() === '!g') {
    //     // var guilds = bot.guilds;
    //     // console.log(guilds);
    //     const roleID = "617826204224847872";
    //     let membersWithRole = message.guild.roles.get(roleID).members;
    //     console.log(membersWithRole);
    //     message.channel.send("```"+JSON.stringify(membersWithRole )+"```");
    //     return;
    // }

    if (message.isMentioned(bot.user)) {
        message.channel.send(['As I see it, yes.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don’t count on it.',
            'It is certain.',
            'It is decidedly so.',
            'Most likely.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Outlook good.',
            'Reply hazy, try again.',
            'Signs point to yes.',
            'Very doubtful.',
            'Without a doubt.',
            'Yes.',
            'Yes – definitely.',
            'You may rely on it.'][Math.floor(Math.random() * 20)+1]);
        return;
    }

    if (message.content.toLowerCase() === '!time') {
        let now = moment();
        message.channel.send(`UTC Time is ${moment().format("HH:mm")}`);
        return;
    }

    if (message.content.toLowerCase() === '!scan' || message.content.toLowerCase() === 'scan') {

        if (message.attachments === undefined || message.attachments.size == 0) {
            message.author.send(helpmsg);
            message.delete();
            return;
        }

        message.attachments.forEach((item) => {

            const re = /(?:\.([^.]+))?$/;
            const ext = re.exec(item.filename)[1].toLowerCase();
            if (ext.match(/^(mkv|mka|mks|mk3d|webm|ogv|oga|ogg|opus|ivf|h261|h263|264|h264|265|h265|hevc|vc1|vc2|y4m|dv|dif|avi|ffm|mov|flv|f4v|swf|flac|alac|nut|asf|ac3|eac3|a52|spdif|rm|aac|hds|ismv|isma|latm|sap|wv|tta|ape|wav|aiff|truehd|smjpeg|sox|adx|daud|au|dts|ast|caf|gxf|ircam|mmf|mxf|alaw|mulaw|roq|thd|voc|w64|adts|amr|ilbc|c2|bit|speex|spx|aptx|aptxhd|sbc|msbc|mpeg|mp2|m2t|m2ts|mts|ts|hls|mpegts|mp3|mp4|m4v|m4a|m4b|mpd|avm2|dvd|vob|vcd|svcd|ipod|psp|3g2|3gp|webp|jpg|jpeg|mjpg|mjpeg|png|apng|jp2|j2k|jpf|jpx|jpm|mj2|pbm|pgm|ppm|bmp|gif)$/)) {
                message.channel.send("Scanning file\n").then((sentmessage) => {

                    const filepath = path.join(__dirname, "temp", item.filename);
                    const file = fs.createWriteStream(filepath);
                    https.get(item.url, function (response) {
                        response.pipe(file);
                        exec("ffprobe -print_format json -show_format -show_streams " + filepath, (error, stdout, stderr) => {
                            if (stderr) {
                                // message.channel.send(stderr);
                            }
                            if (error) {
                                console.error(error);
                                message.channel.send("I broke, help.");
                                return;
                            }

                            let obj = JSON.parse(stdout);

                            console.log(obj);

                            let msg = `\`${item.filename}\`\n\`\`\`\nContainer    : ${obj.format.format_name}\nSize         : ${humanFileSize(obj.format.size)}\n`;
                            if (obj.format.bit_rate) {
                                msg += `Bitrate      : ${humanFileSize(obj.format.bit_rate)}\n`;
                            }
                            if (obj.format.duration) {
                                msg += `Duration     : ${obj.format.duration}\n`;
                            }
                            if (obj.format.tags) {
                                if (obj.format.tags.ENCODER) {
                                    msg += `Encoder      : ${obj.format.tags.ENCODER}\n`
                                }
                            }

                            msg += `\`\`\``;

                            obj.streams.forEach((value) => {

                                msg += `\`\`\`\n+ Stream ${value.index}   : ${value.codec_type}\n`;

                                if (value.codec_name === "h264" || value.codec_name === "h265" || value.codec_name === "aac" || value.codec_name === "mp2" || value.codec_name === "mp3" || value.codec_name === "mpeg2video") {
                                    msg += `| Codec      : Filthy ${value.codec_name}\n`;
                                } else if (value.codec_name === "ac3" || value.codec_name === "eac3") {
                                    msg += `| Codec      : Dirty  ${value.codec_name}\n`;
                                } else {
                                    msg += `| Codec      : ${value.codec_name}\n`;
                                }
                                if (value.profile) {
                                    msg += `| Profile    : ${value.profile}\n`;
                                }
                                if (value.codec_type === "video") {
                                    if (value.pix_fmt) {
                                        msg += `| pix_fmt    : ${value.pix_fmt}\n`;
                                    }
                                    if (value.color_range) {
                                        msg += `| color range: ${value.color_range}\n`;
                                    }
                                    if (value.color_space) {
                                        msg += `| color space: ${value.color_space}\n`;
                                    }
                                    if (value.width && value.height) {
                                        msg += `| res        : ${value.width}x${value.height}\n`;
                                    }
                                    if (value.sample_aspect_ratio && value.display_aspect_ratio) {
                                        msg += `| sar        : ${value.sample_aspect_ratio}\n`
                                        msg += `| dar        : ${value.display_aspect_ratio}\n`;
                                    }

                                } else if (value.codec_type === "audio") {
                                    if (value.channels) {
                                        msg += `| channels   : ${value.channels}\n`;
                                    }
                                    if (value.sample_fmt) {
                                        msg += `| sample fmt : ${value.sample_fmt}\n`;
                                    }
                                    if (value.sample_rate) {
                                        msg += `| sample rate: ${value.sample_rate}\n`;
                                    }

                                } else if (value.codec_type === "subtitles") {
                                    // console.log(value);
                                }

                                msg += "\`\`\`"

                            });
                            sentmessage.edit(msg);
                            // message.channel.send(msg);
                            fs.unlink(filepath, () => {return});
                        });
                    });
                });
            } else {
                // message.delete();
                message.author.send(helpmsg);
                return;
            }

        });
        return;
    }
});

bot.login(token);
