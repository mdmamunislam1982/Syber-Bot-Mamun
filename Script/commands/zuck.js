module.exports.config = {
	name: "zuck",
	version: "3.0.0",
	hasPermssion: 1,
	credits: "CYBER BOT TEAM",
	description: "বাংলা সেফ বোর্ড ইমেজ (No Box)",
	commandCategory: "edit-img",
	usages: "zuck [বাংলা লেখা]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const { createCanvas, loadImage, registerFont } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];

	// 🔤 বাংলা ফন্ট রেজিস্টার (সবচেয়ে গুরুত্বপূর্ণ)
	registerFont(__dirname + "/fonts/SiyamRupali.ttf", {
		family: "BanglaFont"
	});

	let text = args.join(" ");
	if (!text) {
		return api.sendMessage(
			"❌ অনুগ্রহ করে বাংলা লেখা দিন\nউদাহরণ:\n👉 zuck আগে শিখো, তারপর কথা বলো",
			threadID,
			messageID
		);
	}

	let imgPath = __dirname + "/cache/zuck.png";

	// ছবি ডাউনলোড
	let imgData = (await axios.get(
		"https://i.postimg.cc/gJCXgKv4/zucc.jpg",
		{ responseType: "arraybuffer" }
	)).data;

	fs.writeFileSync(imgPath, Buffer.from(imgData, "utf-8"));

	let base = await loadImage(imgPath);
	let canvas = createCanvas(base.width, base.height);
	let ctx = canvas.getContext("2d");

	ctx.drawImage(base, 0, 0);

	// ✍️ বাংলা সেফ লেখা
	let fontSize = 48;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	ctx.font = `${fontSize}px "BanglaFont"`;

	// অটো ফন্ট সাইজ
	while (ctx.measureText(text).width > 1200) {
		fontSize--;
		ctx.font = `${fontSize}px "BanglaFont"`;
	}

	ctx.fillText(text, 20, 80);

	// ছবি পাঠানো
	const buffer = canvas.toBuffer();
	fs.writeFileSync(imgPath, buffer);

	return api.sendMessage(
		{ attachment: fs.createReadStream(imgPath) },
		threadID,
		() => fs.unlinkSync(imgPath),
		messageID
	);
};
