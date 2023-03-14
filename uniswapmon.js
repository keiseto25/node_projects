// uniswapmon v1
// send notifications via firebase (push), but later realized that send to telegram is easier and covers ios and android
//const msg = require('./sendNotif.js');
const msg = require('./sendTelegramNotif.js');

const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon'
const query = `
  {
    pool(id:"0xa374094527e1673a86de625aa59517c5de346d32"){
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
    // Send via Firebase
    //msg.sendNotification('MATIC/USDC',`${token1Price}`)

    // Send via Telegram
    var tPrice = `${token1Price}`
    msg.sendNotification('MATIC/USDC: ' + tPrice)


  })
  .catch(error => console.error(error))
