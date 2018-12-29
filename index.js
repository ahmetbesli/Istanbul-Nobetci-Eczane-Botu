var cron = require('cron');
var cmd = require("node-cmd");

var job1 = new cron.CronJob({
    cronTime: '00 09 10 * * *', // Saat 9:10
    onTick: function () {
        cmd.get('sudo nodejs ./istanbul.js', function (err, data, stderr) {

            console.log("Bot çalıştırıldı");
        });

    },
    start: true,
    timeZone: 'Europe/Istanbul'
});



