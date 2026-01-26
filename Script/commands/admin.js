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

      🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟      

 👤 𝐍𝐚𝐦𝐞      : M A M U N ッ
 🚹 𝐆𝐞𝐧𝐝𝐞𝐫    : 𝐌𝐚𝐥𝐞
 ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧  : always singel
 🎂 𝐀𝐠𝐞       : 19
 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : 𝐈𝐬𝐥𝐚𝐦
 🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : inter 1st year
 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬  : Rajshahi Dhaka, 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡

 🎭 𝐓𝐢𝐤𝐭𝐨𝐤  : Mamun01
 📢 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 : t.me/John_USA90
 🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://www.facebook.com/md.mamun.islam3210

 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}

        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100057754863882/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
