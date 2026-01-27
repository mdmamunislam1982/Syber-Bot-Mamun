const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Profile Fixed 100%",
  description: "হ্যাক ইমেজ - প্রোফাইল দেখাবে",
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

    // ৩টা URL try করবো
    const urls = [
      `https://graph.facebook.com/${uid}/picture?type=large&width=500&height=500`,
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=500&background=1e293b&color=00ff41&bold=true&font-size=0.6`,
      `https://avatar.ams3.digitaloceanspaces.com/?name=${encodeURIComponent(name)}&size=500`
    ];

    let avatarBuffer;
    for (let url of urls) {
      try {
        console.log(`Trying: ${url}`);
        const response = await axios.get(url, { 
          responseType: "arraybuffer", 
          timeout: 8000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        avatarBuffer = Buffer.from(response.data);
        console.log("✅ Avatar downloaded successfully");
        break;
      } catch (e) {
        console.log(`❌ Failed: ${url}`);
        continue;
      }
    }

    if (!avatarBuffer) throw new Error("No avatar found");

    await fs.writeFile(avatarPath, avatarBuffer);

    // Canvas - NO CLIP MASK (সহজ method)
    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, 900, 500);

    // Load avatar
    const avatar = await loadImage(avatarPath);
    
    // Square avatar with rounded corners (ক্লিপ ছাড়া)
    const avatarX = 50;
    const avatarY = 60;
    const avatarSize = 220;

    // Rounded rectangle path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(avatarX + 20, avatarY);
    ctx.lineTo(avatarX + avatarSize - 20, avatarY);
    ctx.quadraticCurveTo(avatarX + avatarSize, avatarY, avatarX + avatarSize, avatarY + 20);
    ctx.lineTo(avatarX + avatarSize, avatarY + avatarSize - 20);
    ctx.quadraticCurveTo(avatarX + avatarSize, avatarY + avatarSize, avatarX + avatarSize - 20, avatarY + avatarSize);
    ctx.lineTo(avatarX + 20, avatarY + avatarSize);
    ctx.quadraticCurveTo(avatarX, avatarY + avatarSize, avatarX, avatarY + avatarSize - 20);
    ctx.lineTo(avatarX, avatarY + 20);
    ctx.quadraticCurveTo(avatarX, avatarY, avatarX + 20, avatarY);
    ctx.closePath();
    
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Green glowing border
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 20;
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 25);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Text content
    ctx.shadowColor = "rgba(0,255,65,0.5)";
    ctx.shadowBlur = 12;

    ctx.fillStyle = "#00ff41";
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = "left";
    ctx.fillText("🔥 SYSTEM BREACHED 🔥", 320, 110);

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 34px Arial';
    ctx.fillText(`TARGET: ${name}`, 320, 170);

    ctx.fillStyle = "#00d4ff";
    ctx.font = '28px Arial';
    ctx.fillText("📊 Data Extracted: 100%", 320, 230);
    ctx.fillText("🔑 Passwords: COMPROMISED", 320, 270);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ff0040";
    ctx.font = 'bold 36px Arial';
    ctx.fillText("✅ HACK COMPLETED", 320, 330);

    // Progress bar
    ctx.fillStyle = "rgba(0,255,65,0.15)";
    ctx.fillRect(320, 380, 480, 35);
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#00ff41";
    ctx.fillRect(320, 380, 460, 35);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 22px Arial';
    ctx.fillText("COMPLETE ACCESS GRANTED", 340, 407);

    // Save
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(outPath, buffer);

    await api.sendMessage({
      body: `💀 ${name} এর সিস্টেম সম্পূর্ণ হ্যাক! 💀

✅ Passwords, data সব কম্প্রোমাইজড!`,
      attachment: fs.createReadStream(outPath)
    }, threadID, messageID);

    // Cleanup
    fs.unlinkSync(avatarPath);
    fs.unlinkSync(outPath);

  } catch (error) {
    console.error("Hack error:", error);
    return api.sendMes
