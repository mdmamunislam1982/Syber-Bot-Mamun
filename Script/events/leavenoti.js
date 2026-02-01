const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "leave",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "MAMUN",
    description: "Notify when someone leaves the group with a random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "moment-timezone": ""
    }
};

module.exports.onLoad = function () {
    const dir = path.join(__dirname, "cache", "leaveGif", "randomgif");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.run = async function({ api, event, Users, Threads }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const { createReadStream, existsSync, readdirSync } = fs;
    const { join } = path;
    const { threadID } = event;

    // সময় সেট করা
    const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
    const hours = moment.tz("Asia/Dhaka").format("HH");

    // গ্রুপ ও ইউজারের ডেটা
    const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "leave" : "managed";

    // ডিফল্ট মেসেজ
    let msg = (typeof data.customLeave == "undefined") ? 
        `⚠️ গুরুতর ঘোষণা ⚠️

{session} || {name} ভাই/বোন গ্রুপ ছেড়ে চলে গেছে…
এখন থেকে গ্রুপের নাটকের বিভাগ আনুষ্ঠানিকভাবে বন্ধ!

—আসলে সে বুঝে গেছে—এখানে তার গুরুত্ব ছিলো ঠিক যেমন WiFi ছাড়া YouTube… একেবারে অর্থহীন!

⏰ তারিখ ও সময়: {time}
⚙️ স্ট্যাটাস: {type}
✍️ সবাই এখন শান্তিতে হাসতে পারবে!` 
        : data.customLeave;

    // Placeholder রিপ্লেস
    msg = msg.replace(/\{name}/g, name)
             .replace(/\{type}/g, type)
             .replace(/\{session}/g, hours <= 10 ? "Morning" : hours <= 12 ? "Afternoon" : hours <= 18 ? "Evening" : "Night")
             .replace(/\{time}/g, time);

    // র‍্যান্ডম মিডিয়া ফাইল খোঁজা
    const randomPath = readdirSync(join(__dirname, "cache", "leaveGif", "randomgif"));
    let formPush;

    if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "cache", "leaveGif", "randomgif", randomPath[Math.floor(Math.random() * randomPath.length)]);
        formPush = { body: msg, attachment: createReadStream(pathRandom) };
    } else {
        formPush = { body: msg };
    }

    return api.sendMessage(formPush, threadID);
};
