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
        --------------------------------------------
𝐍𝐚𝐦𝐞       : 𝐌𝐃 𝐌𝐀𝐌𝐔𝐍
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : 𝐌𝐃 𝐌𝐀𝐌𝐔𝐍 𝐈𝐒𝐋𝐀𝐌�
𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : 𝐈𝐬𝐥𝐚𝐦
𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝐂𝐡𝐚𝐫𝐠𝐡𝐚𝐭,𝐑𝐚𝐣𝐬𝐡𝐚𝐡𝐢

𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: , 𝐑𝐚𝐣𝐬𝐡𝐚𝐡𝐢, 𝐃𝐡𝐚𝐤𝐚, 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡

𝐆𝐞𝐧𝐝𝐞𝐫.   : 𝐌𝐚𝐥𝐞
𝐀𝐠𝐞           : 𝟏8+
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : 𝐒𝐢𝐧𝐠𝐥𝐞
𝐖𝐨𝐫𝐤        : 𝐒𝐭𝐮𝐝𝐞𝐧𝐭
𝐆𝐦𝐚𝐢𝐥       : mamunofficial3210@gmail.com
𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: wa.me/+8801892554541
𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦  : 
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 https://www.facebook.com/md.mamun.islam3210`,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100057754863882/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
