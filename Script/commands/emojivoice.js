/**
 * EMOJI VOICE PROTECTED FILE
 * Credits: 𝐑𝐀𝐇𝐀𝐓 𝐊𝐇𝐀𝐍
 * Anti-Edit + Hidden Cache + Integrity Lock
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

/* ================== CONFIG (LOCKED) ================== */
module.exports.config = {
  name: "emoji_voice",
  version: "10.0",
  hasPermssion: 0,
  credits: "𝐑𝐀𝐇𝐀𝐓 𝐊𝐇𝐀𝐍",
  description: "Emoji দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
  commandCategory: "noprefix",
  usages: "😘🥰😍",
  cooldowns: 5
};

/* ================== EMOJI MAP (LOCKED) ================== */
const emojiAudioMap = Object.freeze({
  "🥱": "https://files.catbox.moe/9pou40.mp3",
  "😁": "https://files.catbox.moe/60cwcg.mp3",
  "😌": "https://files.catbox.moe/epqwbx.mp3",
  "🥺": "https://files.catbox.moe/wc17iq.mp3",
  "🤭": "https://files.catbox.moe/cu0mpy.mp3",
  "😅": "https://files.catbox.moe/jl3pzb.mp3",
  "😏": "https://files.catbox.moe/z9e52r.mp3",
  "😞": "https://files.catbox.moe/tdimtx.mp3",
  "🤫": "https://files.catbox.moe/0uii99.mp3",
  "🍼": "https://files.catbox.moe/p6ht91.mp3",
  "🤔": "https://files.catbox.moe/hy6m6w.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "🤦": "https://files.catbox.moe/ivlvoq.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "😑": "https://files.catbox.moe/p78xfw.mp3",
  "😢": "https://files.catbox.moe/shxwj1.mp3",
  "🙊": "https://files.catbox.moe/3bejxv.mp3",
  "🤨": "https://files.catbox.moe/4aci0r.mp3",
  "😡": "https://files.catbox.moe/shxwj1.mp3",
  "🙈": "https://files.catbox.moe/3qc90y.mp3",
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3",
  "😱": "https://files.catbox.moe/mu0kka.mp3",
  "😻": "https://files.catbox.moe/y8ul2j.mp3",
  "😿": "https://files.catbox.moe/tqxemm.mp3",
  "💔": "https://files.catbox.moe/6yanv3.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "🥹": "https://files.catbox.moe/jf85xe.mp3",
  "😩": "https://files.catbox.moe/b4m5aj.mp3",
  "🫣": "https://files.catbox.moe/ttb6hi.mp3",
  "🐸": "https://files.catbox.moe/utl83s.mp3"
});

/* ================== FILE INTEGRITY LOCK ================== */
const __self = fs.readFileSync(__filename);
const __hash = crypto.createHash("sha256").update(__self).digest("hex");

// change করলে এই hash মিলবে না → auto stop
const LOCK_HASH = __hash;

function integrityCheck() {
  const nowHash = crypto.createHash("sha256")
    .update(fs.readFileSync(__filename))
    .digest("hex");
  return nowHash === LOCK_HASH;
}

/* ================== HIDDEN CACHE ================== */
const hiddenCache = path.join(
  __dirname,
  "." + crypto.createHash("md5").update(__filename).digest("hex").slice(0, 8)
);

/* ================== EVENT ================== */
module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!integrityCheck()) return; // silent kill if edited

    const { threadID, messageID, body } = event;
    if (!body || body.length > 2) return;

    const emoji = body.trim();
    const audioUrl = emojiAudioMap[emoji];
    if (!audioUrl) return;

    if (!fs.existsSync(hiddenCache)) fs.mkdirSync(hiddenCache);

    const filePath = path.join(
      hiddenCache,
      crypto.randomBytes(6).toString("hex") + ".mp3"
    );

    const res = await axios({
      method: "GET",
      url: audioUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        { attachment: fs.createReadStream(filePath) },
        threadID,
        () => fs.unlink(filePath, () => {}),
        messageID
      );
    });

  } catch (e) {
    // no error message → protection
  }
};

/* ================== EMPTY RUN ================== */
module.exports.run = () => {};
