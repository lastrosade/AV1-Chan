// Import the discord.js module
const Discord = require('discord.js')
const fs = require('fs')

// Create an instance of Discord that we will use to control the bot
const bot = new Discord.Client();

// Token for your bot, located in the Discord application console - https://discordapp.com/developers/applications/me/
const token = fs.readFileSync('bot-token.txt',"ascii")

// Gets called when our bot is successfully logged in and connected
bot.on('ready', () => {
    console.log('Hello World!');
});

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {
    // So the bot doesn't reply to iteself
    if (message.author.bot) return;
    if (msg.content === 'ping') {
        msg.reply('Pong!');
        return;
    }

    // Check if the message starts with the `!` trigger
    if (message.content.indexOf('!') === 0) {
        // Get the user's message excluding the `!`
        var text = message.content.substring(1);

        // Reverse the message
        var reversed = '';
        var i = text.length;

        while (i > 0) {
            reversed += text.substring(i - 1, i);
            i--;
        }

        // Reply to the user's message
        message.reply("What the fuck did you just fucking say about AV1, you little bitch? I'll have you know I graduated top of my class in FFmpeg, and I've been involved in numerous secret encodes on nyaa.si, and I have over 300 confirmed encodes. I am trained in gorilla debugging of day 0 appveyor releases and I'm the top shitposter in the entire AV1 subreddit. You are nothing to me but just another video file. I will compress you the fuck out with efficiency the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my #daala IRC across the TOR and your IP is being traced right now so you better prepare for the DDOS, maggot. The storm that wipes out the pathetic little thing you call your seedbox. You're fucking dead, kid. I can be anywhere, anytime, Chrome, Firefox, Opera, you name it. And I am supported in over seven hundred ways, and that's just with my in pre-alpha decoder. Not only am I extensively trained in batch scripting, but I have access to the entire arsenal of the Amazon Web Service and I will use it to its full extent to wipe your miserable h265 encodes off the face of the internet, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your cheetos covered fingers of the keyboard. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.");
    }
});
  

bot.login(token);


