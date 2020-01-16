// Import the discord.js module
const Discord = require('discord.js')
const fs = require('fs')
const https = require('https');
const path = require('path');
const brain = require('brain.js')
const { exec } = require("child_process");

// Create an instance of Discord that we will use to control the bot
const bot = new Discord.Client();
const rich = new Discord.RichEmbed();

// Token for your bot, located in the Discord application console - https://discordapp.com/developers/applications/me/
const token = fs.readFileSync('bot-token.txt',"ascii")

function humanFileSize(size) {
    return size
}

// Gets called when our bot is successfully logged in and connected
bot.on('ready', () => {
    console.log('Hello World!');
});

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {
    // So the bot doesn't reply to iteself
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong!');
        return;
    }

    // if (message.channel.name === "off-topic") {
    //     if (message.member.user.id === "134113602494791680" || message.member.user.id === "551696650826153995" || message.member.user.id === "176413727401312257") {
    //         message.react("👍")
    //     }
    // }

    // if (message.channel.name === "av1-chan_lib")
    if (message.content.toLowerCase() === '!help') {
        let msg = "I scan files.\nTo scan a file upload it with the message '!scan' or 'scan', it **has** to be a single message.";
        message.author.send(msg);
        return;
    }

    // if (message.content === "nice" && message.member.user.id === '132637059327328256') {
    //     message.channel.send("Fail", { files: [path.join(__dirname, "temp", "nice.PNG")] });
    // }

    // if (message.channel.name === "av1-chan_lib" || message.channel.name === "video" || message.channel.name === "files")
    if (message.content.toLowerCase() === '!scan' || message.content.toLowerCase() === 'scan') {

        message.attachments.forEach((item) => {

            const re = /(?:\.([^.]+))?$/;
            const ext = re.exec(item.filename)[1].toLowerCase();
            if ( ext.match(/^(png|exe|txt|log|7z|7zip|tar|gz|lz|bz2|xz|zip)$/)) {
                return
            }

            message.channel.send("Scanning file\n").then((sentmessage) => {

                const filepath = path.join(__dirname, "temp", item.filename);
                const file = fs.createWriteStream(filepath);
                https.get(item.url, function(response) {
                    response.pipe(file);
                    exec("ffprobe -print_format json -show_format -show_streams "+filepath, (error, stdout, stderr) => {
                        if (stderr) {
                            // message.channel.send(stderr);
                        }
                        if (error) {
                            console.error(error);
                            message.channel.send("I broke, help.");
                            return;
                        }

                        obj = JSON.parse(stdout);

                        console.log(obj);

                        let msg = `${item.filename}\n\`\`\`\nContainer    : ${obj.format.format_name}\nSize         : ${humanFileSize(obj.format.size)}\n`;
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

                            if (value.codec_name === "h264" || value.codec_name === "h265") {
                                msg += `| Codec      : Filthy ${value.codec_name}\n`;
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

                            } else if (value.codec_type === "subtitles") {
                                // console.log(value);
                            }

                            msg += "\`\`\`"

                        });
                        sentmessage.edit(msg)
                        // message.channel.send(msg);
                    });
                });
            });
        });
        return;
    }
});

bot.login(token);
