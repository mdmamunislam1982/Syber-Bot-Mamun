const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emoji_voice",
    version: "1.1.0",
    author: "ALVI-BOSS",
    countDown: 5,
    role: 0,
    shortDescription: "ইমোজি দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
    longDescription: "যে কোনো নির্দিষ্ট ইমোজি পাঠালে কিউট ভয়েস মেসেজ পাঠাবে 😘। আপডেটেড: ভালো এরর হ্যান্ডলিং এবং টেম্প ফাইল ম্যানেজমেন্ট।",
    category: "noPrefix"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const { body } = event;
    if (!body || body.length !== 1 || !/[😀-🙏]/u.test(body)) return; // শুধুমাত্র একক emoji চেক

    const emojiAudioMap = {
      "🥱": "https://files.catbox.moe/9pou40.mp3",  
      "😁": "https://files.catbox.moe/60cwcg.mp3",  
      "😌": "https://files.catbox.moe/epqwbx.mp3",  
      "🥺": "https://files.catbox.moe/wc17iq.mp3",  
      "🤭": "https://files.catbox.moe/cu0mpy.mp3",  
      "😅": "https://files.catbox.moe/jl3pzb.mp3",  
      "😏": "https://files.catbox.moe/z9e52r.mp3",  
      "😞": "https://files.catbox.moe/tdimtx.mp3",  
      "🤫": "https://files.catbox.moe/0uii99.mp3",  
      "🍼": "https://files.catbox.moe/p6ht91.mp3",  
      "🤔": "https://files.catbox.moe/hy6m6w.mp3",  
      "🥰": "https://files.catbox.moe/dv9why.mp3",  
      "🤦": "https://files.catbox.moe/ivlvoq.mp3",  
      "😘": "https://files.catbox.moe/sbws0w.mp3",  
      "😑": "https://files.catbox.moe/p78xfw.mp3",  
      "😢": "https://files.catbox.moe/shxwj1.mp3",  
      "🙊": "https://files.catbox.moe/3bejxv.mp3",  
      "🤨": "https://files.catbox.moe/4aci0r.mp3",  
      "😡": "https://files.catbox.moe/shxwj1.mp3",  
      "🙈": "https://
