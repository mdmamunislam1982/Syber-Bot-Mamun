const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "emoji_voice",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mamun",
  description: "Emoji দিলে voice পাঠাবে",
  commandCategory: "noprefix",
  usages: "😍 😘 🥰",
  cooldowns: 3
};

const emojiAudioMap = {
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3"
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (!event.body) return;

    // 🔥 Mirai emoji normalize
    const msg = event.body.trim().replace(/\uFE0F/g, "");

    if (!emojiAudioMap[msg]) return;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `${Date.now()}.mp3`);

    const res = await axios.get(emojiAudioMap[msg], {
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        { attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    });

  } catch (err) {
    console.log("emoji_voice error:", err);
  }
};

module.exports.run = () => {};
