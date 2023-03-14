const admin = require('firebase-admin');
const serviceAccount = require('./res/key.json');
const fs = require('fs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://console.firebase.google.com/project/uniswapmon/database/uniswapmon-default-rtdb/data/~2F'
});

function sendNotification(title, body, token) {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: token
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });

}

function getToken(title, body, token) {
    fs.readFile('res/token.txt', 'utf8', function (err, data) {
        if (err) throw err;

        // Split the contents of the file into an array of rows
        const rows = data.split('\n');

        // Iterate over each row and perform some operation
        rows.forEach(function (row) {
            sendNotification(title, body, row)
        });

    });
}

module.exports = {
    sendNotification
};