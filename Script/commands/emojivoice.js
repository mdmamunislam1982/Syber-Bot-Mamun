const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "emoji",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mamun",
  description: "Emoji দিলে voice পাঠাবে",
  commandCategory: "fun",
  usages: "emoji 😍",
  cooldowns: 3
};

const emojiAudioMap = {
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3"
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!args[0]) {
      return api.sendMessage(
        "❌ Emoji দাও\nউদাহরণ: emoji 😍",
        event.threadID,
        event.messageID
      );
    }

    const emoji = args[0].replace(/\uFE0F/g, "");
    if (!emojiAudioMap[emoji]) {
      return api.sendMessage("❌ এই emoji support করে না", event.threadID);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `${Date.now()}.mp3`);

    const res = await axios.get(emojiAudioMap[emoji], {
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

  } catch (e) {
    api.sendMessage("⚠️ Error হয়েছে", event.threadID);
    console.log(e);
  }
};
