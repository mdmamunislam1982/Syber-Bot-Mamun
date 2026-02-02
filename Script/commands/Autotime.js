const schedule = require("node-schedule");
const chalk = require("chalk");

module.exports.config = {
  name: "autosent",
  version: "10.0.2",
  hasPermssion: 0,
  credits: "Shahadat Islam (updated)",
  description: "Automatically sends messages at scheduled times (BD Time)",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

const messages = [
  { time: "12:00 AM", message: "এখন সময় রাত 12:00 AM ⏳\nঅনেক রাত হলো, ঘুমিয়ে পড় Bby 😴💤❤️" },
  { time: "1:00 AM", message: "এখন সময় রাত 1:00 AM ⏳\nএখনো ঘুমাস নাই? তাড়াতাড়ি ঘুমা! 😴😾" },
  { time: "2:00 AM", message: "এখন সময় রাত 2:00 AM ⏳\nঘুমে আয় ভাই! 😤💤" },
  { time: "3:00 AM", message: "এখন সময় রাত 3:00 AM ⏳\nএখনো জাইগা? 🙄🌃" },
  { time: "4:00 AM", message: "এখন সময় ভোর 4:00 AM ⏳\nএকটু পর আজান হবে 🕌" },
  { time: "5:00 AM", message: "ফজরের নামাজ পড়ে নিও 🕌🤲" },
  { time: "6:00 AM", message: "Good Morning 🌅💖 উঠে পড়ো!" },
  { time: "7:00 AM", message: "ঘুম ভাঙতেই মোবাইল? দাঁত ব্রাশ কর 🪥📱" },
  { time: "8:00 AM", message: "খাওয়া-দাওয়া করে নাও 🍽️" },
  { time: "9:00 AM", message: "Breakfast করছো তো? 🍳🥞" },
  { time: "10:00 AM", message: "আজ কলেজ নাই নাকি? 😜📚" },
  { time: "11:00 AM", message: "নাটক বাদ দাও, কাজ কর 🙄💼" },
  { time: "12:00 PM", message: "Good Afternoon 🌞" },
  { time: "1:00 PM", message: "জোহরের নামাজ পড়ে নাও 🕌" },
  { time: "2:00 PM", message: "গোসল + খাওয়া শেষ কর 🛁🍽️" },
  { time: "3:00 PM", message: "দুপুরে ঘুম 😴💔" },
  { time: "4:00 PM", message: "আজ খুব গরম 🥵🌞" },
  { time: "5:00 PM", message: "হাসতে ভুলো না 😅" },
  { time: "6:00 PM", message: "Good Evening 🌆" },
  { time: "7:00 PM", message: "পড়তে বসছো নাকি? 😏📚" },
  { time: "8:00 PM", message: "আমার বস শাহাদাৎ কে একটা গিফ দাও 😎🔥" },
  { time: "9:00 PM", message: "খানা খাইছো? 😘🍽️" },
  { time: "10:00 PM", message: "এখনো খাও নাই? 😜📱" },
  { time: "11:00 PM", message: "ঘুমাতে যাও 😴🛌" }
];

let isScheduled = false;

module.exports.run = ({ api }) => {
  if (isScheduled) return;
  isScheduled = true;

  console.log(chalk.green("✅ AUTOSENT SCHEDULER STARTED (BD TIME)"));

  messages.forEach(({ time, message }) => {
    const [hour, minute, period] = time.split(/[: ]/);
    let h = parseInt(hour);

    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const rule = new schedule.RecurrenceRule();
    rule.tz = "Asia/Dhaka";
    rule.hour = h;
    rule.minute = parseInt(minute);

    schedule.scheduleJob(rule, () => {
      const threads =
        global.data.allThreadID ||
        global.data.allThreadIDs ||
        [];

      threads.forEach(threadID => {
        api.sendMessage(message, threadID);
      });
    });

    console.log(chalk.cyan(`⏰ Scheduled: ${time}`));
  });
};
