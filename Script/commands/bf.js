const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");

module.exports.config = {
  name: "bf",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mamun (Fixed by ChatGPT)",
  description: "Mention two users to make a couple image",
  commandCategory: "fun",
  usages: "bf @mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const cachePath = path.join(__dirname, "cache", "canvas");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

  const bgPath = path.join(cachePath, "bg.png");
  if (!fs.existsSync(bgPath)) {
    const url = "https://i.imgur.com/iaOiAXe.jpg"; // simple bg
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(res.data));
  }
};

async function circleImage(imgPath) {
  const img = await Jimp.read(imgPath);
  img.circle();
  await img.writeAsync(imgPath);
  return imgPath;
}

async function downloadAvatar(uid, savePath) {
  const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(savePath, Buffer.from(res.data));
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const mentionIDs = Object.keys(event.mentions || {});
  if (mentionIDs.length === 0) {
    return api.sendMessage("😆 একজনকে মেনশন করো! উদাহরণ: bf @friend", threadID, messageID);
  }

  const targetID = mentionIDs[0];

  const cachePath = path.join(__dirname, "cache", "canvas");
  const bgPath = path.join(cachePath, "bg.png");
  const onePath = path.join(cachePath, `${senderID}.png`);
  const twoPath = path.join(cachePath, `${targetID}.png`);
  const outPath = path.join(cachePath, `bf_${senderID}_${targetID}.png`);

  try {
    await downloadAvatar(senderID, onePath);
    await downloadAvatar(targetID, twoPath);

    await circleImage(onePath);
    await circleImage(twoPath);

    const bg = await Jimp.read(bgPath);
    const one = await Jimp.read(onePath);
    const two = await Jimp.read(twoPath);

    bg.resize(800, 400);
    one.resize(200, 200);
    two.resize(200, 200);

    bg.composite(one, 150, 100);
    bg.composite(two, 450, 100);

    await bg.writeAsync(outPath);

    return api.sendMessage(
      {
        body: "🫢🙂 দুই হৃদয়ের একসাথে সুন্দর মুহূর্ত 💞",
        attachment: fs.createReadStream(outPath)
      },
      threadID,
      () => {
        fs.unlinkSync(onePath);
        fs.unlinkSync(twoPath);
        fs.unlinkSync(outPath);
      },
      messageID
    );
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ ইমেজ বানাতে সমস্যা হয়েছে, পরে আবার চেষ্টা করো!", threadID, messageID);
  }
};
