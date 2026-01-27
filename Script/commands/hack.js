const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Profile Fixed - Generated Avatar",
  description: "হ্যাক ইমেজ - সুন্দর avatar",
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

    const timestamp = Date.now();
    const avatarPath = path.join(cacheDir, `avatar_${timestamp}.png`);
    const outPath = path.join(cacheDir, `hack_${timestamp}.png`);

    // ✅ Name থেকে সুন্দর avatar generate
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=1a1a2e&color=00ff41&bold=true&font-size=0.6`;
    
    console.log(`🎨 Generating avatar for: ${name}`);
    
    const response = await axios.get(avatarUrl, { 
      responseType: "arraybuffer", 
      timeout: 10000 
    });
    
    await fs.writeFile(avatarPath, Buffer.from(response.data));
    console.log("✅ Avatar generated successfully");

    // Canvas
    const canvas = createCanvas(1000, 550);
    const ctx = canvas.getContext("2d");

    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 550);
    gradient.addColorStop(0, "#0a0f1e");
    gradient.addColorStop(0.5, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 550);

    // Load avatar
    const avatar = await loadImage(avatarPath);
    
    // Perfect circular avatar
    const avatarSize = 260;
    const centerX = 80 + avatarSize/2;
    const centerY = 120 + avatarSize/2;

    // Glow effect
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 25;
    
    // Outer glow circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize/2 + 15, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
    ctx.fill();

    // Clip perfect circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 80, 120, avatarSize, avatarSize);
    ctx.restore();

    // Glowing border
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarSize/2, 0, Math.PI * 2);
    ctx.stroke();

    // Reset shadow for text
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,255,136,0.8)";

    // Main title
    ctx.fillStyle = "#00ff88";
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = "left";
    ctx.shadowBlur = 15;
    ctx.fillText("🔥 SYSTEM HACK DETECTED 🔥", 380, 140);

    // Target info
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 38px Arial';
    ctx.shadowBlur = 10;
    ctx.fillText(`🎯 TARGET: ${name}`, 380, 210);

    // Data breach info
    ctx.fillStyle = "#00d4ff";
    ctx.font = '32px Arial';
    ctx.shadowBlur = 8;
    ctx.fillText("💾 Data Extracted: 100%", 380, 270);
    ctx.fillText("🔑 Passwords: COMPROMISED", 380, 315);
    ctx.fillText("📱 Messages: DOWNLOADED", 380, 360);

    // Status
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ff3366";
    ctx.font = 'bold 40px Arial';
    ctx.shadowColor = "#ff3366";
    ctx.shadowBlur = 20;
    ctx.fillText("✅ HACK SUCCESSFUL", 380, 430);

    // Progress bar
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,255,136,0.2)";
    ctx.fillRect(380, 470, 520, 40);
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(380, 470, 500, 40);

    // Progress text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 26px Arial';
    ctx.fillText("FULL SYSTEM ACCESS GRANTED", 400, 500);

    // Save image
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(outPath, buffer);

    await api.sendMessage({
      body: `💀 ${name} এর সিস্টেম সম্পূর্ণভাবে হ্যাক হয়েছে! 💀

` +
            `✅ Passwords, messages, data - সব কম্প্রোমাইজড!
` +
            `⚡ Generated avatar ব্যবহার করা হয়েছে`,
      attachment: fs.createReadStream(outPath)
    }, threadID, messageID);

    // Cleanup
    fs.unlinkSync(avatarPath);
    fs.unlinkSync(outPath);

  } catch (error) {
    console.error("Hack error:", error.message);
    return api.sendMessage(
      `❌ ${name} এর জন্য হ্যাক করতে সমস্যা!

Console চেক করুন`, 
      threadID, messageID
    );
  }
};
