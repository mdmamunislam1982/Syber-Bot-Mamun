const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Fixed - Simple Version",
  description: "হ্যাক ইমেজ কমান্ড",
  commandCategory: "fun",
  usages: "hack @mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, messageID, mentions, senderID } = event;
  const uid = Object.keys(mentions)[0] || senderID;
  const name = await Users.getNameUser(uid);

  try {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    // ✅ সরাসরি Facebook Graph API ব্যবহার
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?type=large`;
    const avatarPath = path.join(cacheDir, `avatar_${Date.now()}.png`);
    const outPath = path.join(cacheDir, `hack_${Date.now()}.png`);

    console.log(`📥 Downloading: ${avatarUrl}`);

    // Avatar download
    const response = await axios.get(avatarUrl, { 
      responseType: "arraybuffer", 
      timeout: 10000 
    });
    
    await fs.writeFile(avatarPath, Buffer.from(response.data));
    console.log("✅ Avatar downloaded");

    // Canvas
    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // Dark background
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, 900, 500);

    // Load avatar
    const avatar = await loadImage(avatarPath);
    
    // Circular avatar (সহজ উপায়)
    ctx.save();
    ctx.beginPath();
    ctx.arc(140, 160, 110, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 30, 50, 220, 220);
    ctx.restore();

    // Green border
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(140, 160, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Texts
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 10;

    ctx.fillStyle = "#00ff41";
    ctx.font = 'bold 35px Arial';
    ctx.fillText("🔥 SYSTEM HACKED 🔥", 300, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`TARGET: ${name}`, 300, 160);

    ctx.fillStyle = "#00d4ff";
    ctx.font = '28px Arial';
    ctx.fillText("📊 Data Extracted: 100%", 300, 220);
    ctx.fillText("💾 Passwords: COMPROMISED", 300, 260);

    ctx.fillStyle = "#ff0040";
    ctx.font = 'bold 34px Arial';
    ctx.fillText("✅ HACK SUCCESSFUL", 300, 320);

    // Progress bar
    ctx.fillStyle = "rgba(0,255,65,0.2)";
    ctx.fillRect(300, 370, 450, 30);
    ctx.fillStyle = "#00ff41";
    ctx.fillRect(300, 370, 430, 30);

    // Save & Send
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(outPath, buffer);

    await api.sendMessage({
      body: `💀 ${name} এর সিস্টেম হ্যাক হয়ে গেছে! 💀`,
      attachment: fs.createReadStream(outPath)
    }, threadID, messageID);

    // Cleanup
    fs.unlinkSync(avatarPath);
    fs.unlinkSync(outPath);

  } catch (error) {
    console.error("Hack error:", error.message);
    
    // Error message
    return api.sendMessage(
      `❌ ${name} এর প্রোফাইল লোড করতে সমস্যা!

` +
      `🔧 সমাধান:
` +
      `• ইন্টারনেট চেক করুন
` +
      `• Facebook profile public কিনা চেক করুন
` +
      `• আবার চেষ্টা করুন`, 
      threadID, 
      messageID
    );
  }
};
