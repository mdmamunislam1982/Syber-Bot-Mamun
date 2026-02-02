const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝙼𝚊𝚖𝚞𝚗", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
━━━━━━━━━━━━━
🧑‍💼 𝙾𝚠𝚗𝚎𝚛 𝙸𝚗𝚏𝚘
╭─╼━━━━━━━━╾─╮
│ 👑 𝙽𝚊𝚖𝚎     : 𝙼𝚊𝚖𝚞𝚗
│ 🏠 𝙵𝚛𝚘𝚖     : 𝚈𝚘𝚞𝚛 𝙷𝚎𝚊𝚛𝚝
│ 🎓 𝙲𝚕𝚊𝚜𝚜    : 11
│ 🎂 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢 : 𝟷2 𝙳𝚎𝚌𝚎𝚖𝚋𝚎𝚛
│ 🕌 𝚁𝚎𝚕𝚒𝚐𝚒𝚘𝚗 : 𝙸𝚜𝚕𝚊𝚖
│ ❤️ 𝚁𝚎𝚕𝚊𝚝𝚒𝚘𝚗 : 𝚂𝚎𝚌𝚛𝚎𝚝
│ 🔗 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 : 𝙴𝚠'𝚛 𝙼𝚊𝚖𝚞𝚗
╰─━━━━━━━━━╾─╯
━━━━━━━━━━━━━
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100057754863882/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
