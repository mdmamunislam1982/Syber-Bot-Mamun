const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emoji_voice",
    version: "1.1.0",
    author: "ALVI-BOSS (updated)",
    countDown: 3,
    role: 0,
    shortDescription: "ইমোজি দিলে কিউট মেয়ের ভয়েস 😍",
    longDescription: "নির্দিষ্ট ইমোজি পাঠালে কিউট ভয়েস মেসেজ পাঠাবে 😘",
    category: "noPrefix"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const body = event.body?.trim();
    if (!body) return;

    const emojiAudioMap = {
      "🥱": "https://files.catbox.moe/9pou40.mp3",
      "😁": "https://files.catbox.moe/60cwcg.mp3",
      "😌": "https://files.catbox.moe/epqwbx.mp3",
      "🥺": "https://files.catbox.moe/wc17iq.mp3",
      "🤭": "https://files.catbox.moe/cu0mpy.mp3",
      "😅": "https://files.catbox.moe/jl3pzb.mp3",
      "😞": "https://files.catbox.moe/7rodvm.mp3",
      "🤫": "https://files.catbox.moe/0uii99.mp3",
      "🤔": "https://files.catbox.moe/hy6m6w.mp3",
      "🥰": "https://files.catbox.moe/dv9why.mp3",
      "😘": "https://files.catbox.moe/sbws0w.mp3",
      "😢": "https://files.catbox.moe/shxwj1.mp3",
      "😍": "https://files.catbox.moe/qjfk1b.mp3",
      "😭": "https://files.catbox.moe/itm4g0.mp3",
      "😂": "https://files.catbox.moe/sn8c6e.mp3",
      "🤣": "https://files.catbox.moe/2sweut.mp3",
      "😩": "https://files.catbox.moe/b4m5aj.mp3",
      "🥳": "https://files.catbox.moe/ynpd2f.mp3",
      "🎉": "https://files.catbox.moe/ynpd2f.mp3",
      "🫂": "https://files.catbox.moe/u9j39a.mp3",
      "❤️‍🩹": "https://files.catbox.moe/g4b0qw.mp3",
      "😎": "https://files.catbox.moe/sn33xe.mp3",
      "🤦‍♀️": "https://files.catbox.moe/vwtxj1.mp3",
      "💝": "https://files.catbox.moe/gcjnq5.mp3"
    };

    const audioUrl = emojiAudioMap[body];
    if (!audioUrl) return;

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const fileName = encodeURIComponent(body) + ".mp3";
    const filePath = path.join(cacheDir, fileName);

    try {
      if (!fs.existsSync(filePath)) {
        const res = await axios.get(audioUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data));
      }

      await message.reply({
        attachment: fs.createReadStream(filePath)
      });
    } catch (e) {
      console.error(e);
      message.reply("আজ মন ভালো না 😒\nপরে আবার ইমোজি দিও 😘");
    }
  }
};
