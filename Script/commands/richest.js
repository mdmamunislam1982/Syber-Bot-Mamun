module.exports.config = {
  name: "richest",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mamun",
  description: "Top richest users",
  commandCategory: "Economy",
  cooldowns: 10
};

module.exports.run = async ({ api, event, Currencies, Users }) => {
  const allData = await Currencies.getAll(['userID', 'money']);
  const sorted = allData.sort((a, b) => b.money - a.money).slice(0, 10);

  let msg = "🏆 Top 10 Richest Users 🏆\n\n";
  let i = 1;

  for (const user of sorted) {
    const name = await Users.getNameUser(user.userID);
    msg += `${i}. ${name} — 💰 ${user.money}\n`;
    i++;
  }

  return api.sendMessage(msg, event.threadID, event.messageID);
};
