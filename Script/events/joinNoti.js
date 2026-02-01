module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Mamun",
  description: "Stylish welcome message for new members"
};

module.exports.run = async function ({ api, event, Threads, Users }) {
  const threadID = event.threadID;
  const userID = event.logMessageData.addedParticipants[0].userFbId;

  const name = await Users.getNameUser(userID);
  const threadInfo = await Threads.getInfo(threadID);

  const memberCount = threadInfo.participantIDs.length;
  const time = new Date().toLocaleTimeString("en-GB");
  const date = new Date().toLocaleDateString("en-GB");

  const session =
    new Date().getHours() < 12 ? "🌅 Morning" :
    new Date().getHours() < 18 ? "🌞 Afternoon" :
    "🌙 Evening";

  const msg = 
`👋 Hello ${name}
🎀 Welcome to ${threadInfo.threadName} 🌊
✨ You're the ${memberCount} member of this group
⏰ Join Time: ${time} – ${date}
🌍 Session: ${session}

━━━━━━━━━━━━━━
🤖 CYBER Bot Mamun
👑 Powered by Mamun`;

  return api.sendMessage(msg, threadID);
};
