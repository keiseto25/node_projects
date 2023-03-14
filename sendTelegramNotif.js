const TelegramBot = require('node-telegram-bot-api');



function sendNotification(text, chatid) {

    const botToken = '6043717452:AAFkYEE7IMMuc_aYaTf9N3ZxXIcs4XLJrcQ';
    const bot = new TelegramBot(botToken, { polling: false });
    const chatId = chatid;
    const options = { parse_mode: 'HTML' };

    bot.sendMessage(chatId, text, options);
}


module.exports = {
    sendNotification
};