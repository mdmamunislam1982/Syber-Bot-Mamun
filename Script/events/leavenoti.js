module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.1.0",
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Notify when someone leaves the group",
	dependencies: {
		"fs-extra": "",
		"path": "",
		"moment-timezone": ""
	}
};

module.exports.onLoad = function () {
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];

	const gifPath = join(__dirname, "cache", "leaveGif", "randomgif");
	if (!existsSync(gifPath)) mkdirSync(gifPath, { recursive: true });
};

module.exports.run = async function ({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const moment = require("moment-timezone");

	const { threadID } = event;

	const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
	const hours = parseInt(moment.tz("Asia/Dhaka").format("HH"));

	const data =
		global.data.threadData.get(threadID) ||
		(await Threads.getData(threadID)).data;

	const userID = event.logMessageData.leftParticipantFbId;
	const name =
		global.data.userName.get(userID) ||
		(await Users.getNameUser(userID));

	const type =
		event.author == userID ? "নিজে লিভ দিছে" : "এডমিন কিক দিছে";

	let session =
		hours <= 10 ? "𝙈𝙤𝙧𝙣𝙞𝙣𝙜" :
		hours <= 12 ? "𝘼𝙛𝙩𝙚𝙧𝙉𝙤𝙤𝙣" :
		hours <= 18 ? "𝙀𝙫𝙚𝙣𝙞𝙣𝙜" :
		"𝙉𝙞𝙜𝙝𝙩";

	let msg = data.customLeave || 
`╭═════⊹⊱✫⊰⊹═════╮
⚠️ গুরুতর ঘোষণা ⚠️
╰═════⊹⊱✫⊰⊹═════╯

{session} || {name}
তিনি চলে গেছে… গ্রুপের নাটক factory বন্ধ, আর meme quality এখন full HD!
Leave দিয়ে গেলো… importance ছিল WiFi ছাড়া YouTube-এর মতো—একেবারে useless! Drama supplier gone… এখন গ্রুপের সবাই এখন শান্তিতে হাসতে পারবে!
⏰ সময়: {time}
⚙️ স্ট্যাটাস: {type}

✍️ কমেন্টে জানাও তোমার অনুভূতি...`;

	msg = msg
		.replace(/\{name}/g, name)
		.replace(/\{type}/g, type)
		.replace(/\{session}/g, session)
		.replace(/\{time}/g, time);

	const gifFolder = join(__dirname, "cache", "leaveGif", "randomgif");
	let formPush = { body: msg };

	if (existsSync(gifFolder)) {
		const files = readdirSync(gifFolder);
		if (files.length > 0) {
			const randomFile = files[Math.floor(Math.random() * files.length)];
			formPush.attachment = createReadStream(join(gifFolder, randomFile));
		}
	}

	return api.sendMessage(formPush, threadID);
};
