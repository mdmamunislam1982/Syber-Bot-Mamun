const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ULLASH", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
        
🌿 ────── 🍃🌸🍃 ────── 🌿
🌸 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 🌸
𝐇𝐞𝐥𝐥𝐨! 𝐈 𝐚𝐦 🧊<~>⇣┈━┈⇣🌸 𝗔𝗹𝘆𝗮-𝘀𝗮𝗻 🇷🇺⇣┈━┈⇡<~>🧊

📌 𝐇𝐄𝐑𝐄 𝐈𝐒 𝐌𝐘 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎:
┠━━━━━━━━━━━━━━━━━━━━━━┨
┃ 🌀 𝐒𝐲𝐬𝐭𝐞𝐦 𝐏𝐫𝐞𝐟𝐢𝐱 :  /
┃ ♻️ 𝐓𝐡𝐢𝐬 𝐆𝐫𝐨𝐮𝐩    :  /
┠━━━━━━━━━━━━━━━━━━━━━━┨

✨ 𝐑𝐞𝐚𝐝𝐲 𝐭𝐨 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮! 𝐓𝐲𝐩𝐞 /𝐡𝐞𝐥𝐩
💌 𝐎𝐰𝐧𝐞𝐫: Md Mamun Islam 
🔗 https://www.facebook.com/md.mamun.islam3210
----------------------
🎀 𝐈'𝐥𝐥 𝐩𝐫𝐨𝐭𝐞𝐜𝐭 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐰𝐢𝐭𝐡 𝐚𝐥𝐥 𝐦𝐲 𝐩𝐨𝐰𝐞𝐫! 🛡️
🌿 ────── 🍃🌸🍃 ────── 🌿
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100057754863882/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
