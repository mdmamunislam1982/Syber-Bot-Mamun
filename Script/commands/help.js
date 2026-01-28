const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "MAMUN",
  description: "Shows all commands with details",
  commandCategory: "system",
  usages: "[command/page]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  en: {
    moduleInfo: `
✨ COMMAND INFO ✨
🔖 Name: %1
📄 Usage: %2
📜 Description: %3
🔑 Permission: %4
👨‍💻 Credit: %5
📂 Category: %6
⏳ Cooldown: %7s

⚙ Prefix: %8
🤖 Bot Name: %9
👑 Owner: Mamun
`,
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Admin Bot"
  }
};

/* ✅ Direct image links only */
const helpImages = [
  ![image]"(https://i.imgur.com/qAjChmF.jpeg)",
  "https://i.imgur.com/5QnK2s9.jpg"
];

function downloadImages(callback) {
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
  const filePath = path.join(cacheDir, "help.jpg");

  request(randomUrl)
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback([filePath]));
}

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  /* ===== Single command info ===== */
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());

    const perm =
      command.config.hasPermssion == 0
        ? getText("user")
        : command.config.hasPermssion == 1
        ? getText("adminGroup")
        : getText("adminBot");

    const text = getText(
      "moduleInfo",
      command.config.name,
      command.config.usages || "Not Provided",
      command.config.description || "Not Provided",
      perm,
      command.config.credits || "Unknown",
      command.config.commandCategory || "Unknown",
      command.config.cooldowns || 0,
      prefix,
      global.config.BOTNAME || "Mamun Chat Bot"
    );

    return downloadImages(files => {
      api.sendMessage(
        { body: text, attachment: fs.createReadStream(files[0]) },
        threadID,
        () => fs.unlinkSync(files[0]),
        messageID
      );
    });
  }

  /* ===== Command list ===== */
  const list = Array.from(commands.keys()).sort();
  const page = Math.max(parseInt(args[0]) || 1, 1);
  const perPage = 20;
  const totalPages = Math.ceil(list.length / perPage);

  const view = list.slice((page - 1) * perPage, page * perPage);
  const msg = view.map(c => `┃ ✪ ${c}`).join("\n");

  const text = `
📜 COMMAND LIST 📜
📄 Page: ${page}/${totalPages}
🧮 Total: ${list.length}

${msg}

⚙ Prefix: ${prefix}
🤖 Bot: ${global.config.BOTNAME || "Mamun Chat Bot"}
👑 Owner: Mamun
`;

  downloadImages(files => {
    api.sendMessage(
      { body: text, attachment: fs.createReadStream(files[0]) },
      threadID,
      () => fs.unlinkSync(files[0]),
      messageID
    );
  });
};
