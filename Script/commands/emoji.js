const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "text_voice",
    version: "1.1.0",
    author: "MOHAMMAD AKASH (updated)",
    countDown: 3,
    role: 0,
    shortDescription: "নির্দিষ্ট টেক্সটে কিউট ভয়েস 😍",
    longDescription: "নির্দিষ্ট টেক্সট পাঠালে কিউট মেয়ের ভয়েস রিপ্লাই দিবে 😘",
    category: "noprefix",
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const body = event.body?.trim().toLowerCase();
    if (!body) return;

    const textAudioMap = {
      "i love you": "https://files.catbox.moe/npy7kl.mp3",
      "mata beta": "https://files.catbox.moe/5rdtc6.mp3",
    };

    const audioUrl = textAudioMap[body];
    if (!audioUrl) return;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `${encodeURIComponent(body)}.mp3`);

    try {
      // 🔹 আগেই ফাইল থাকলে আবার ডাউনলোড করবে না
      if (!fs.existsSync(filePath)) {
        const res = await axios.get(audioUrl, {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(filePath, Buffer.from(res.data));
      }

      await message.reply({
        attachment: fs.createReadStream(filePath),
      });

    } catch (err) {
      console.error(err);
      message.reply("আজ ভয়েস আসতে চায় না 😅\nপরে আবার ট্রাই করো ❤️");
    }
  },
};
