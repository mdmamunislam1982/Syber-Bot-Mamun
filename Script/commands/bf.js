module.exports.config = {
  name: "mentest",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Test",
  description: "Test mention in Mirai",
  commandCategory: "test",
  usages: "mentest @mention",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const mentionIDs = Object.keys(event.mentions || {});
  if (!mentionIDs.length) {
    return api.sendMessage("❌ Mirai-তে মেনশন ধরা যাচ্ছে না!", event.threadID, event.messageID);
  }
  return api.sendMessage(`✅ Mirai-তে মেনশন কাজ করছে! ID: ${mentionIDs[0]}`, event.threadID, event.messageID);
};
