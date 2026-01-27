const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "2.3.0",
  hasPermssion: 0,
  credits: "Fixed Profile Image Version",
  description: "বাংলা হ্যাক স্টাইল ইমেজ কমান্ড",
  commandCategory: "fun",
  usages: "hack @mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, mentions, senderID } = event;
    const uid = Object.keys(mentions)[0] || senderID;
    const name = await Users.getNameUser(uid);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const avatarPath = path.join(cacheDir, `avatar_${Date.now()}.png`);
    const outPath = path.join(cacheDir, `hack_${Date.now()}.png`);

    // Fixed profile image download
    let avatarUrl;
    try {
      // Method 1: Try api.getUserInfo with callback
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(uid, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      avatarUrl = userInfo[uid]?.profileUrl || userInfo[uid]?.thumbUrl;
      
      // Method 2: Fallback to constructed URL
      if (!avatarUrl) {
        avatarUrl = `https://graph.facebook.com/${uid}/picture?type=large&width=500&height=500`;
      }
    } catch (e) {
      console.log("getUserInfo failed, using fallback URL");
      avatarUrl = `https://graph.facebook.com/${uid}/picture?type=large&width=500&height=500`;
    }

    console.log(`Downloading avatar from: ${avatarUrl}`);

    // Download with better error handling
    const response = await axios({
      method: 'GET',
      url: avatarUrl,
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    await fs.writeFile(avatarPath, Buffer.from(response.data));
    console.log("Avatar downloaded successfully");

    // Canvas setup
    const canvas = createCanvas(850, 420);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw avatar with circular mask
    const ava = await loadImage(avatarPath);
    
    // Circular avatar with glow effect
    const avatarSize = 240;
    const centerX = 40 + avatarSize / 2;
    const centerY = 90 + avatarSize / 2;

    // Outer glow
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize / 2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(34, 197, 94, 0.3)";
    ctx.fill();

    // Clip mask for perfect circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(ava, 40, 90, avatarSize, avatarSize);
    ctx.restore();

    // Avatar border
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Text with better styling
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Title
    ctx.fillStyle = "#22c55e";
    ctx.font = 'bold 34px "Segoe UI", Arial';
    ctx.textAlign = "start";
    ctx.fillText("⚠️ সিস্টেম হ্যাক করা হচ্ছে...", 320, 130);

    // Target name
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 32px "Segoe UI", Arial';
    ctx.fillText(`🎯 টার্গেট: ${name}`, 320, 195);

    // Status texts
    ctx.fillStyle = "#38bdf8";
    ctx.font = '28px "Segoe UI", Arial';
    ctx.fillText("📡 ডাটা সংগ্রহ করা হচ্ছে...", 320, 250);

    ctx.fillStyle = "#10b981";
    ctx.font = 'bold 32px "Segoe UI", Arial';
    ctx.fillText("✅ স্ট্যাটাস: হ্যাক সফল", 320, 310);

    // Progress bar
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
    ctx.fillRect(320, 350, 400, 25);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(320, 350, 380, 25); // 95% progress

    // Progress text
    ctx.fillStyle = "#ffffff";
    ctx.font = '20px Arial';
    ctx.fillText("95% সম্পন্ন | প্রক্রিয়া চলমান...", 330, 372);

    // Save and send
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(outPath, buffer);

    await api.sendMessage({
      body: `🧑‍💻 ${name} এর হ্যাক সম্পন্ন! 

⚡ সমস্ত ডাটা সংগ্রহ করা হয়েছে ✅`,
      attachment: fs.createReadStream(outPath)
    }, threadID, messageID);

    // Cleanup
    await fs.unlink(avatarPath).catch(() => {});
    await fs.unlink(outPath).catch(() => {});

  } catch (err) {
    console.error("Hack Error:", err.message);
    
    // Send error image if avatar fails
    const canvas = createCanvas(850, 420);
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 850, 420);
    
    ctx.fillStyle = "#ef4444";
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = "center";
    ctx.fillText("❌ প্রোফাইল লোড ব্যর্থ!", 425, 210);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = '32px Arial';
    ctx.fillText("ইন্টারনেট চেক করুন বা আবার চেষ্টা করুন", 425, 260);
    
    const errorBuffer = canvas.toBuffer("image/png");
    const errorPath = path.join(__dirname, "cache", `error_${Date.now()}.png`);
    await fs.writeFile(errorPath, errorBuffer);
    
    await api.sendMessage({
      body: `❌ ${name} এর প্রোফাইল লোড করতে সমস্যা হয়েছে!

🔧 সম্ভাব্য কারণ:
• দুর্বল ইন্টারনেট
• প্রাইভেট প্রোফাইল
• Facebook API সমস্যা

আবার চেষ্টা করুন!`,
      attachment: fs.createReadStream(errorPath)
    }, threadID, messageID);
    
    await fs.unlink(errorPath).catch(() => {});
  }
};
