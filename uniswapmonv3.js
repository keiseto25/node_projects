// uniswapmon v3
// 14-03-2023 : read a input.csv file containing the poolid, chatid (from telegram), lowprice, highprice
const msg = require('./sendTelegramNotif.js');
const moment = require('moment-timezone');
const fs = require('fs');
const csv = require('csv-parser');


const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon'


function checkPrice(query, lowPrice, highPrice) {
  fetch(subgraphUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(data => {
      const { token0, token0Price, token1, token1Price } = data.data.pool
      var tPrice = parseFloat(token1Price);
      var t0Symbol = token0.symbol;
      var t1Symbol = token1.symbol;
      //var lowPrice = parseFloat(lowPrice);
      //var highPrice = parseFloat(highPrice);
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

      //setTimeout(checkPrice, 30000 * 60); // Execute every hour

    })

    .catch(error => console.error(error))

}

function wLog(txt) {
  const fs = require('fs');

  // Open the log file for appending
  const logStream = fs.createWriteStream('log/app.log', { flags: 'a' });

  // Write a message to the log file
  logStream.write(txt + '\n');

  // Close the log file
  logStream.end();

}

fs.createReadStream('input/input.csv')
  .pipe(csv({ separator: ';' })) // specify the separator as semicolon
  .on('data', (row) => {
    const { poolid, chatid, lowprice, highprice } = row;
    // Do something with the row data
    var query = `
  {
    pool(id:"${poolid}"){
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
`
    checkPrice(query, lowprice, highprice); // start the price check and notification loop    
  })
  .on('end', () => {
  });




