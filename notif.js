const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BLop2g91pH7TpQIm1dFEmzatYzBl9PdGwEnKdYsLm-IO9YDIXYAddRE_ZvTA2RScW8tprEZayGkA_cGgq7ht-UY",
    "privateKey": "EDAiScJrgDJfSWnUpE0mY29JeFq_G6__se16Dj9wgvk"
}
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/frxs52Pqibs:APA91bH7WCtBXbAxjOgu4FT4Uua3GrmZ0UwerPAdWVdkom53rlg0CiHk1Kkn3SdoCdWVdxXbUIPAumh3U2dxibTsvzaknrBPbfQwnXZSUr_epE5hEgnQbBtplesKzUFNvfbE_-wIuu4Q",
    "keys": {
        "p256dh": "BFoUMTLTc1F6ee8OU/adYDOGz4e0z7JlcAtL2cQx3NloDR4GdyzGsUwtsoAzjcWhTIx6DbDlrpvGWFLfP6o/Sco=",
        "auth": "8w8RmIuOew9TCssd34Kh4Q=="
    }
};

const payload = 'Mau info tentang pertandingan bola';
const options = {
    gcmAPIKey: '859700007877',
    TTL: 60
};
webPush.sendNotification(
        pushSubscription,
        payload,
        options
    )
    .catch(function (err) {
        console.log(err);
    });