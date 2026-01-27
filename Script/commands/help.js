module.exports.config = {
  name: "help",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "FREE SET-UP MESSENGER",
  commandCategory: "system",
  usages: "[name/page/all]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "\n" +
      " | Mamun 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁\n" +
      " |●𝗡𝗮𝗺𝗲: %1\n" +
      " |●𝗨𝘀𝗮𝗴𝗲: %3\n" +
      " |●𝗗𝗲𝘀𝗰𝗿𝗶p𝘁𝗶𝗼𝗻: %2\n" +
      " |●𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n" +
      " |●𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %5s\n" +
      " |●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n" +
      " |𝗖𝗼𝗱𝗲 𝗯𝘆: MAMUN ッ\n" +
      "",
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot"
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const fs = require("fs-extra");
  const request = require("request");
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  /* ===== HELP ALL ===== */
  if (args[0] === "all") {
    let groups = {};
    for (const [, cmd] of commands) {
      const cat = cmd.config.commandCategory || "other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(cmd.config.name);
    }

    let msg = "";
    for (let cat in groups) {
      msg += `❄️ ${cat.toUpperCase()}\n${groups[cat].join(" • ")}\n\n`;
    }

    const img =
      "https://i.imgur.com/dWQGPtL.jpg"; // ✅ direct image

    request(img)
      .pipe(fs.createWriteStream(__dirname + "/cache/help.jpg"))
      .on("close", () => {
        api.sendMessage(
          {
            body:
              "✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿\n\n" +
              msg +
              `Use: ${prefix}help [name/page]`,
            attachment: fs.createReadStream(
              __dirname + "/cache/help.jpg"
            )
          },
          threadID,
          (err, info) => {
            fs.unlinkSync(__dirname + "/cache/help.jpg");
            if (autoUnsend)
              setTimeout(
                () => api.unsendMessage(info.messageID),
                delayUnsend * 1000
              );
          },
          messageID
        );
      });
    return;
  }

  /* ===== COMMAND LIST / PAGE ===== */
  if (!commands.has((args[0] || "").toLowerCase())) {
    const list = [...commands.keys()].sort();
    const page = parseInt(args[0]) || 1;
    const perPage = 15;

    const slice = list.slice(
      (page - 1) * perPage,
      page * perPage
    );

    let msg = slice.map(c => `• ${c}`).join("\n");

    return api.sendMessage(
      `📜 COMMAND LIST (Page ${page}/${Math.ceil(
        list.length / perPage
      )})\n\n${msg}\n\nUse ${prefix}help [name]`,
      threadID,
      messageID
    );
  }

  /* ===== SINGLE COMMAND INFO ===== */
  const cmd = commands.get(args[0].toLowerCase());
  return api.sendMessage(
    getText(
      "moduleInfo",
      cmd.config.name,
      cmd.config.description,
      `${prefix}${cmd.config.name} ${cmd.config.usages || ""}`,
      cmd.config.commandCategory,
      cmd.config.cooldowns,
      cmd.config.hasPermssion == 0
        ? getText("user")
        : cmd.config.hasPermssion == 1
        ? getText("adminGroup")
        : getText("adminBot")
    ),
    threadID,
    messageID
  );
};
