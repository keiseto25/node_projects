const TelegramBot = require('node-telegram-bot-api');



function sendNotification(text) {

    const botToken = '6043717452:AAFkYEE7IMMuc_aYaTf9N3ZxXIcs4XLJrcQ';
    const bot = new TelegramBot(botToken, { polling: false });
    const chatId = '1300084781';
    const options = { parse_mode: 'HTML' };

    bot.sendMessage(chatId, text,options);
}


module.exports = {
    sendNotification
};