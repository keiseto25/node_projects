const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const TOKEN = '6043717452:AAFkYEE7IMMuc_aYaTf9N3ZxXIcs4XLJrcQ';
const bot = new TelegramBot(TOKEN);

module.exports = async (req, res) => {
  try {
    const { body } = req;
    const update = JSON.parse(body);

    await bot.processUpdate(update);
    res.end('OK');
  } catch (error) {
    console.error(error);
    res.status(500).end('Internal Server Error');
  }
};

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const poolId = query.data;

  bot.sendMessage(chatId, 'Valor inicial:', { reply_markup: { remove_keyboard: false } });
  const lowPrice = message.text;
  bot.sendMessage(chatId, 'Valor final:', { reply_markup: { remove_keyboard: true } });
  const highPrice = message.text;
  bot.once('message', async (message) => {


    const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon';
    const query = `
      {
        pool(id:"${poolId}"){
          token0 {
            id
            symbol
          }
          token0Price
          token1 {
            id
            symbol
          }
          token1Price
        }
      }
    `;

    const response = await fetch(subgraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    const { token0, token0Price, token1, token1Price } = data.data.pool;
    var tPrice = parseFloat(token1Price);
    var t0Symbol = token0.symbol;
    var t1Symbol = token1.symbol;    
    const timestamp = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
    var pVariationlow = ((lowPrice - tPrice) / lowPrice) * 100;
    var pVariationhigh = ((tPrice - highPrice) / highPrice) * 100;

    if (tPrice < lowPrice) {
      var txt = '⚠️⬇️ <b>[' + timestamp + ']</b> : ' + t0Symbol + '/' + t1Symbol + ' abaixo de ' + lowPrice + ': \n\n 👉 ' + tPrice.toFixed(4) + '(-' + pVariationlow.toFixed(2) + '%)';
      console.log(txt);
      msg.sendNotification(txt);
      wLog(txt);
    } else if (tPrice > highPrice) {
      var txt = '⚠️⬆️ <b>[' + timestamp + ']</b> : ' + t0Symbol + '/' + t1Symbol + ' acima de ' + highPrice + ': \n\n 👉 ' + tPrice.toFixed(4) + '(+' + pVariationhigh.toFixed(2) + '%)'
      console.log(txt);
      msg.sendNotification(txt);
      wLog(txt);
    } else {
      var txt = '[' + timestamp + '] : ' + t0Symbol + '/' + t1Symbol + ' dentro intervalo de ' + lowPrice + ' a ' + highPrice + ': \n\n ' + tPrice.toFixed(4)
      console.log(txt);
      wLog(txt);
    }

  });
});

bot.onText(/\/start/, async (message) => {
  const chatId = message.chat.id;

  bot.sendMessage(chatId, 'Welcome to the Uniswap V3 bot! Please select a pool ID:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Pool ID 1', callback_data: '0xa374094527e1673a86de625aa59517c5de346d32' },
          { text: 'Pool ID 2', callback_data: '0x1234567890123456789012345678901234567890' },
        ],
      ],
    },
  });
});

bot.onText(/^(?!\/start).*$/, async (message) => {
  const chatId = message.chat.id;

  bot.sendMessage(chatId, 'Invalid command. Please use /start to begin.');
});

function wLog(txt) {
  const fs = require('fs');

  // Open the log file for appending
  const logStream = fs.createWriteStream('log/app.log', { flags: 'a' });

  // Write a message to the log file
  logStream.write(txt + '\n');

  // Close the log file
  logStream.end();

}