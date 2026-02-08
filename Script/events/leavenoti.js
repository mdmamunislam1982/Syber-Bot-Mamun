module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.1.1",
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Notify when someone leaves or is removed from the group",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  // bot leave ignore
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { threadID } = event;

  const data =
    global.data.threadData.get(parseInt(threadID)) ||
    (await Threads.getData(threadID)).data;

  const userID = event.logMessageData.leftParticipantFbId;
  const name =
    global.data.userName.get(userID) || (await Users.getNameUser(userID));

  // ✅ FIXED ternary + multiline string
  const type =
    event.author == userID
      ? `🛑 এই বলদ....!! 😹
𝗠𝘂𝗻𝗻𝗮 𝗩𝗮𝗹𝗼 𝗖𝗵𝗲𝗹𝗲  
💬 গ্রুপ থেকে লিভ নেওয়া কি মুখের কথা নাকি? 😏`
      : `👑 যে গ্রুপে আমি থাকি..?? 🐸  
⚠️ সেই গ্রুপ থেকে লিভ নেওয়া অসম্ভব ভাই! 😂  
🌀 আবার অ্যাড করে দিলাম 😇  

━━━━━━━━━━━━━━━
👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : 𝐌𝐝 𝐌𝐚𝐦𝐮𝐧 𝐈𝐬𝐥𝐚𝐦 💎
━━━━━━━━━━━━━━━`;

  const dirPath = path.join(__dirname, "𝐌𝐝 𝐌𝐚𝐦𝐮𝐧 𝐈𝐬𝐥𝐚𝐦", "leaveGif");
  const gifPath = path.join(dirPath, "leave1.gif");

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  let msg =
    typeof data.customLeave == "undefined"
      ? "👋 {name}\n{type}"
      : data.customLeave;

  msg = msg.replace(/{name}/g, name).replace(/{type}/g, type);

  const sendData = fs.existsSync(gifPath)
    ? { body: msg, attachment: fs.createReadStream(gifPath) }
    : { body: msg };

  return api.sendMessage(sendData, threadID);
};
