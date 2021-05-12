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

// Gets called when our bot is successfully logged in and connected
bot.on("ready", () => {
	console.log("Running");
});

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
			message.channel.send("rolled: "+Math.floor(1+Math.random() * roll[2]));
		} else if (roll[1] > 0 && roll[1] < 101 && roll[2] > 1 && roll[2] < 1001) {
			console.log(roll);
			let res = "";
			let total = 0;
			let dice = 0;
			res = "rolled: ";
			for (let i = 0; i < roll[1]; i++) {
				dice = Math.floor(1+Math.random() * roll[2]);
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
	if (homoglyphSearch.search(msg_fmt_1, ["hentai"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["hentie"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["hen tie"]).length > 0) {
		let hentai = db.getData("/counters/hentai_counter")+1;
		db.push("/counters/hentai_counter", hentai); 
		db_change = true;
		let rand = Math.floor(Math.random() * 100);
		if (rand >= 80 && rand <= 88) { //Lalena
			message.channel.send("<@510226090376298516>, "+hentai);
		} else if (rand == 89) { //Tim
			message.channel.send("<@280389433176621058>, "+hentai);
		} else if (rand == 90) { //Troc
			message.channel.send("<@720988177648713819>, "+hentai);
		} else if (rand == 91) { //Blue
			message.channel.send("<@321486891079696385>, "+hentai);
		} else {
			message.channel.send(hentai);
		}

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

	if (homoglyphSearch.search(msg_fmt_1, ["nvidia"]).length > 0) {
		let rand = Math.floor(Math.random() * 100);
		if (rand >= 80 && rand <= 88) {
			message.channel.send("novideo");
		} else if (rand >= 90 && rand <= 94) {
			message.channel.send("Cursed");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["h265"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["h264"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["aac"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["divx"]).length > 0 ||
		homoglyphSearch.search(msg_fmt_1, ["mp3"]).length > 0) {
		if (Math.random() * 100 > 85 ) {
			message.channel.send("Cursed");
		}
	} else if (homoglyphSearch.search(msg_fmt_1, ["opus"]).length > 0) {
		if (Math.floor(Math.random() * 100) > 86 ) {
			message.channel.send(":b:opus");
		}
	}

	if (message.content.includes("😑")) {
		message.channel.send("Cursed");
		let cursed_expressionless = db.getData("/counters/cursed_expressionless")+1; 
		db.push("/counters/cursed_expressionless", cursed_expressionless); 
		db_change = true;
	}
	// 😑

	if (homoglyphSearch.search(msg_fmt_1, ["food"]).length > 0 && message.author.id == "132637059327328256") {
		message.channel.send("Yes");
	}

	if (db_change) {
		db.save();
		db_change = false;
	}
});

bot.login(token);
