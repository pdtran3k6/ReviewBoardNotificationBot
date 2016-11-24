var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

server.use(restify.bodyParser());
server.post('/api/notify', function (req, res, next) {
    //Process posted notification
    var address = req.body.address;
    var notification = req.body.notification;

    console.log(address);
    console.log(notification);

    return next();
    // Send notification as a proactive message
    // var msg = new builder.Message()
    //     .address(address)
    //     .text(notification);

    // bot.send(msg, function (err) {
    //     // Return success/failure
    //     res.status(err ? 500 : 200);
    //     res.end();
    // });
});

//var myAddress;
//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', 
//     function (session, results) {
//         myAddress = session.message.address;
//         session.send(JSON.stringify(myAddress));
//     }
// );

bot.dialog('/notify', 
    function (session, results) {
        session.send("hello, this is a proactive message from the bot");
    }
);

bot.beginDialog({
    "id":"ngd0k0abg059gjil9",
    "channelId":"emulator",
    "user":
    {
        "id":"default-user",
        "name":"User"
    },
    "conversation":
    {
        "id":"1e45gd2cej2519g7c"
    },
    "bot":
    {
        "id":"default-bot"
    },
    "serviceUrl":"http://localhost:9002",
    "useAuth":false
}, '/notify');

