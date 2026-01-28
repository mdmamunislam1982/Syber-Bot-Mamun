module.exports.config = {
  name: "islam",
  version: "2.0.0",
  hasPermssion: 1, // 🔒 Admin only
  credits: "Islamick Chat",
  description: "ইসলামিক ভিডিও পাঠায় (ক্যাটাগরি সহ)",
  commandCategory: "media",
  usages: "islam [nashid/waz/quran]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const textMsg = "•┄┅════❁🌺❁════┅┄•\n\n🕌 আসসালামু আলাইকুম\nআপনার জন্য একটি ইসলামিক ভিডিও\n\n•┄┅════❁🌺❁════┅┄•";

  // 🎞️ ক্যাটাগরি অনুযায়ী ভিডিও
  const videos = {
    nashid: [
      "https://drive.google.com/uc?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH",
      "https://drive.google.com/uc?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O"
    ],
    waz: [
      "https://drive.google.com/uc?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW",
      "https://drive.google.com/uc?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD"
    ],
    quran: [
      "https://drive.google.com/uc?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
      "https://drive.google.com/uc?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD"
    ]
  };

  const type = (args[0] || "").toLowerCase();

  if (!videos[type]) {
    return api.sendMessage(
      "❌ ক্যাটাগরি দিন:\n\n👉 islam nashid\n👉 islam waz\n👉 islam quran",
      event.threadID,
      event.messageID
    );
  }

  const link = videos[type][Math.floor(Math.random() * videos[type].length)];
  const path = __dirname + "/cache/islam.mp4";

  const callback = () => api.sendMessage(
    { body: textMsg, attachment: fs.createReadStream(path) },
    event.threadID,
    () => fs.unlinkSync(path),
    event.messageID
  );

  request(encodeURI(link))
    .pipe(fs.createWriteStream(path))
    .on("close", callback);
};
