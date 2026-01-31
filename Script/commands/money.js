module.exports.config = {
  name: "money",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mamun",
  description: "Check your balance",
  commandCategory: "Economy",
  cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
  const { senderID, threadID, messageID } = event;
  const money = (await Currencies.getData(senderID)).money || 0;
  return api.sendMessage(`💰 আপনার বর্তমান ব্যালান্স: ${money} টাকা`, threadID, messageID);
};
