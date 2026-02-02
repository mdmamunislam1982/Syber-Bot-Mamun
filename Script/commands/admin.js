const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

module.exports.config = {
  name: "admin",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝙼𝚊𝚖𝚞𝚗", // don't change credit
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
  const imgPath = path.join(__dirname, "cache", "admin.png");

  // ensure cache folder
  fs.ensureDirSync(path.join(__dirname, "cache"));

  const body = 
`━━━━━━━━━━━━━
🧑‍💼 𝙾𝚠𝚗𝚎𝚛 𝙸𝚗𝚏𝚘
╭─╼━━━━━━━━╾─╮
│ 👑 𝙽𝚊𝚖𝚎     : 𝙼𝚊𝚖𝚞𝚗
│ 🏠 𝙵𝚛𝚘𝚖     : 𝚈𝚘𝚞𝚛 𝙷𝚎𝚊𝚛𝚝
│ 🎓 𝙲𝚕𝚊𝚜𝚜    : 11
│ 🎂 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢 : 12 𝙳𝚎𝚌𝚎𝚖𝚋𝚎𝚛
│ 🕌 𝚁𝚎𝚕𝚒𝚐𝚒𝚘𝚗 : 𝙸𝚜𝚕𝚊𝚖
│ ❤️ 𝚁𝚎𝚕𝚊𝚝𝚒𝚘𝚗 : 𝚂𝚎𝚌𝚛𝚎𝚝
│ 🔗 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 : 𝙴𝚠'𝚛 𝙼𝚊𝚖𝚞𝚗
╰─━━━━━━━━━╾─╯
━━━━━━━━━━━━━
⏰ ${time}`;

  const callback = () => {
    api.sendMessage(
      {
        body,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath)
    );
  };

  request(
    `https://graph.facebook.com/100057754863882/picture?height=720&width=720`
  )
    .pipe(fs.createWriteStream(imgPath))
    .on("close", callback);
};
