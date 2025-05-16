const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// O'zingning tokenlaringni shu yerga joylashtir
const TELEGRAM_TOKEN = "7937589532:AAGPvGrNQcdMojXhyZbSR9DMquZPjxjHtdo";
const WEATHER_API_KEY = "fc8c76790183baffcb82a95041b44000";

// Botni ishga tushiramiz
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Start komandasi
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Salom, ${msg.from.first_name}! 
Qaysi shaharning ob-havo ma'lumotini bilmoqchisiz?
Shunchaki shahar nomini yozing (masalan: Tashkent)`
  );
});

// Foydalanuvchidan kelgan matnni olish va ob-havo chaqirish
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const city = msg.text;

  // Agar bu komandamas bo‘lsa
  if (!city.startsWith("/")) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=uz`;
      const response = await axios.get(url);
      const data = response.data;

      const text = `
📍 Joylashuv: ${data.name}, ${data.sys.country}
🌡 Harorat: ${data.main.temp}°C
☁️ Ob-havo: ${data.weather[0].description}
💨 Shamol: ${data.wind.speed} m/s
`;

      bot.sendMessage(chatId, text);
    } catch (error) {
      bot.sendMessage(
        chatId,
        `⚠️ Ob-havo topilmadi. Iltimos, shahar nomini to'g'ri yozing.`
      );
    }
  }
});
