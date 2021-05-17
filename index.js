"use strict";

// Import the discord.js module
const fs = require("fs");

// DB
let JsonDB = require("node-json-db").JsonDB;
let Config = require("node-json-db/dist/lib/JsonDBConfig").Config;
var db = new JsonDB(new Config("DB", false, false, "/"));
let db_change = false;

let homoglyphSearch = require("homoglyph-search");

// Create an instance of discord that we will use to control the bot
const discord = require("discord.js");
const bot = new discord.Client();
// const rich = new discord.RichEmbed();

// Token for your bot, located in the discord application console - https://discordapp.com/developers/applications/me/
const token = fs.readFileSync("bot-token.txt", "ascii");

const roll_regex = /^(\d+)d(\d+)/;

const myrand = (max, offset=0) => {
	return Math.floor(offset+Math.random()*max);
};

// Gets called when our bot is successfully logged in and connected
bot.on("ready", () => {
	console.log("Running");
});

bot.on("guildBanAdd", member => {
	member.guild.channels.get("615105639567589376").send("${user.username} got funnied by a mod with a ban hammer");
	// 615105639567589376 #off-topic
});

// bot.on("guildMemberAdd", member => {
// 	console.log(member);
// 	member.guild.channels.get("615105639567589376").send("Welcome <@${member.id}>\nIf you need help on AV1 video compression, or even various types of other video codecs, you can go in <#587033245061873759>	and ask help from our lovely expert encoding members. If you need help or suggestions in image compression, you can go in #image. For anything related to audio, you can go in <#662412664252923924> obviously. For anything related to hardware/hardware design, scientific knowledge and technology, you can find us in <#719811866959806514>.\nIf you're a software developer or interested in software development in general, there is the <#686197510733299755> category.");

// 	// 615105639567589376 #off-topic
// 	// 587033245061873759 #video
// 	// 662412664252923924 #audio
// 	// 719811866959806514 #hardware
// 	// 686197510733299755 #developpement
// });

// Event to listen to messages sent to the server where the bot is located
bot.on("message", message => {

	db.reload();
	db_change = false;

	// console.log(message.author.username, message.content);

	// So the bot doesn"t reply to iteself
	if (message.author.bot) return;


	if (message.content.toLowerCase() === "ping") {
		message.reply("Pong! "+bot.ping+"ms");
		return;
	}

	const msg_lower = message.content.toLowerCase();

	const roll = roll_regex.exec(msg_lower);
	if (roll) {
		if (roll[1] === "1" && roll[2] > 1 && roll[2] < 1001) {
			message.channel.send("rolled: "+myrand(roll[2], 1));
		} else if (roll[1] > 0 && roll[1] < 101 && roll[2] > 1 && roll[2] < 1001) {
			console.log(roll);
			let res = "";
			let total = 0;
			let dice = 0;
			res = "rolled: ";
			for (let i = 0; i < roll[1]; i++) {
				dice = myrand(roll[2], 1);
				res = res+dice+" ";
				total += dice;
			}
			res = res+"\ntotaling: "+total;
			message.channel.send(res);
		} else {
			message.channel.send("Valid rolls 1-100 dices, 2-1000 faces");
		}
	}

	const msg_fmt_1 = msg_lower.replace(/\s/g, ).replace(/<[^>]*>/g, );
	if (homoglyphSearch.search(msg_fmt_1, ["hentai", "hentie"]).length > 0 ||
		homoglyphSearch.search(msg_lower, ["hen tie"]).length > 0) {
		let hentai = db.getData("/counters/hentai_counter")+1;
		db.push("/counters/hentai_counter", hentai); 
		db_change = true;
		if (hentai % 500 === 0) {
			message.channel.send(hentai+" 🎉 <@510226090376298516> <@280389433176621058> <@720988177648713819> <@321486891079696385> <@353367770030931970> 🎉");
		} else {
			let addtext = "";
			if (hentai % 100 === 0) {
				addtext = "🎉 ";
			} else if (hentai === 1337) {
				addtext = "leet bruh";
			}
			let rand = myrand(100);
			if (rand >= 80 && rand <= 88) { //Lalena
				message.channel.send("<@510226090376298516>, "+addtext+hentai);
			} else if (rand == 89) { //Tim
				message.channel.send("<@280389433176621058>, "+addtext+hentai);
			} else if (rand == 90) { //Troc
				message.channel.send("<@720988177648713819>, "+addtext+hentai);
			} else if (rand == 91) { //Blue
				message.channel.send("<@321486891079696385>, "+addtext+hentai);
			} else if (rand == 92) { // Jake000
				message.channel.send("<@353367770030931970>, "+addtext+hentai);
			} else {
				message.channel.send(addtext+" "+hentai);
			}
		}

		// 230732686145093632 Montec
		// 280389433176621058 Tim
		// 720988177648713819 Troc
		// 510226090376298516 lalena
		// 551696650826153995 alex
		// 321486891079696385 blue
	}

	// if you read this and discover the counters, please don't spam them,
	//  they are there for stats

	if (homoglyphSearch.search(msg_fmt_1, ["jeremylee.sh"]).length > 0) {
		let jeremyleesh = db.getData("/counters/jeremyleesh_counter")+1; 
		db.push("/counters/jeremyleesh_counter", jeremyleesh); 
		db_change = true;
	}

	if (homoglyphSearch.search(msg_fmt_1, ["av1an"]).length > 0) {
		let av1an = db.getData("/counters/av1an_counter")+1; 
		db.push("/counters/av1an_counter", av1an); 
		db_change = true;
	}

	if (homoglyphSearch.search(msg_fmt_1, ["hav1t"]).length > 0) {
		let hav1t = db.getData("/counters/hav1t_counter")+1; 
		db.push("/counters/hav1t_counter", hav1t); 
		db_change = true;
	}
	
	if (homoglyphSearch.search(msg_lower, ["mod abuse"]).length > 0) {
		let rand = myrand(100);
		if (rand >= 80 && rand <= 99) {

			let str  = myrand(2, 1) == 1 ? "l" : "L";
			str += myrand(2, 1) == 1 ? "i" : "I";
			str += myrand(2, 1) == 1 ? "t" : "T";
			str += myrand(2, 1) == 1 ? "e" : "E";
			str += myrand(2, 1) == 1 ? "r" : "R";
			str += myrand(2, 1) == 1 ? "a" : "A";
			str += myrand(2, 1) == 1 ? "l" : "L";
			str += myrand(2, 1) == 1 ? "l" : "L";
			str += myrand(2, 1) == 1 ? "y" : "Y";
			message.channel.send(str+" 1984");
		}
	}

	if (homoglyphSearch.search(msg_fmt_1, ["nvidia"]).length > 0) {
		let rand = myrand(100);
		if (rand >= 80 && rand <= 88) {
			message.channel.send("novideo");
		} else if (rand >= 90 && rand <= 94) {
			message.channel.send("Cursed");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["h265", "h264", "aac", "divx", "mp3", "mpeg"]).length > 0) {
		if (myrand(100) > 85 ) {
			message.channel.send("Cursed");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["opus"]).length > 0) {
		if (myrand(100) > 86 ) {
			message.channel.send(":b:opus");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["jpegxl"]).length > 0) {
		if (myrand(100) > 95 ) {
			message.channel.send("j:b:egxl");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["vp9"]).length > 0) {
		if (myrand(300) == 100 ) {
			message.channel.send("vp⑨");
		}
	}

	// 😑
	if (message.content.includes("😑")) {
		if (myrand(100) > 86 ) {
			message.channel.send("Cursed");
			let cursed_expressionless = db.getData("/counters/cursed_expressionless")+1; 
			db.push("/counters/cursed_expressionless", cursed_expressionless); 
			db_change = true;
		}
	}

	if (homoglyphSearch.search(msg_fmt_1, ["food"]).length > 0 && message.author.id == "132637059327328256") {
		message.channel.send("Yes");
	}

	if (db_change) {
		db.save();
		db_change = false;
	}
});

bot.login(token);
