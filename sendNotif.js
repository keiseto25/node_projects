const admin = require('firebase-admin');
const serviceAccount = require('./res/key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://console.firebase.google.com/project/uniswapmon/database/uniswapmon-default-rtdb/data/~2F'
});

function sendNotification(title, body) {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: 'cpLJWkCSSFGjGI4d4uPLEP:APA91bGon7HQoyqzOOUTH-J7aW0cnX_TKn6hnebBL_MFHF0eIhvDXoeLKbAMPqzI2asLcvi5vaCSGcSuxXjBGhaO3QcsU1xjm90xS0YYGo2f0plzatGwo3GE6Egren1Hg4_BITEh54Ob'
    };

    const message2 = {
        notification: {
            title: title,
            body: body,
        },
        token: 'eUxapTCwShSGWBWJUxfcBv:APA91bHQvyt-1bmpxvuW2MrNpzd-Ilf0k6YpEjs3mWme_pD3Keui1Ehh447FBx930KoMeNr4nrW_G843wumlaKv2C6w0NvU-gYEeLLkIIUuO7A-HqTv7v_2R0tT-QTXRbzX_xBjPR0OS'
    };




    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });

    admin.messaging().send(message2)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}


module.exports = {
    sendNotification
};