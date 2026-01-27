const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Bangla Version by ChatGPT",
  description: "বাংলা হ্যাক স্টাইল ইমেজ কমান্ড",
  commandCategory: "fun",
  usages: "hack @mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, mentions, senderID } = event;

    // Mention করা ইউজার না থাকলে sender ধরা হবে
    const uid = Object.keys(mentions)[0] || senderID;
    const name = await Users.getNameUser(uid);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const avatarPath = path.join(cacheDir, "avatar.png");
    const outPath = path.join(cacheDir, "hack.png");

    // প্রোফাইল ছবি ডাউনলোড
    const userInfo = await api.getUserInfo(uid);
const avatarUrl = userInfo[uid].profileUrl;

const avatar = (
  await axios.get(avatarUrl, { responseType: "arraybuffer" })
).data;

fs.writeFileSync(avatarPath, Buffer.from(avatar));
    // Canvas তৈরি
    const canvas = createCanvas(850, 420);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar বসানো
    const ava = await loadImage(avatarPath);
    ctx.drawImage(ava, 40, 80, 250, 250);

    // Text লেখা
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 30px Arial";
    ctx.fillText("⚠️ সিস্টেম হ্যাক করা হচ্ছে...", 320, 110);

    ctx.fillStyle = "#ffffff";
    ctx.font = "26px Arial";
    ctx.fillText(`টার্গেট: ${name}`, 320, 170);

    ctx.fillStyle = "#38bdf8";
    ctx.fillText("ডাটা সংগ্রহ করা হচ্ছে...", 320, 220);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 28px Arial";
    ctx.fillText("স্ট্যাটাস: সফল ✅", 320, 280);

    // ফাইল সেভ
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    // Messenger এ পাঠানো
    return api.sendMessage(
      {
        body: "🧑‍💻 হ্যাক সম্পন্ন হয়েছে!",
        attachment: fs.createReadStream(outPath)
      },
      threadID,
      () => fs.unlinkSync(outPath),
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ সমস্যা হয়েছে, পরে আবার চেষ্টা করুন", event.threadID);
  }
};
