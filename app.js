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

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
bot.dialog("/", function(session, result) {
    session.send("I'm in the zone");
    session.replaceDialog("/createSubscription");
});
bot.dialog('/createSubscription', function (session) {
    // Serialize users address to a string.
    var address = JSON.stringify(session.message.address);
    session.send(address);
});

//server.use(restify.bodyParser());
// server.post('/api/notify', function (req, res) {
//     //Process posted notification
//     var address = {
//     "id":"dfefwc",
//     "channelId":"emulator",
//     "user":
//     {
//         "id":"default-user",
//         "name":"User"
//     },
//     "conversation": {
//         "id": "lhmga4i8dl5f9ci6i"
//     },
//     "bot":
//     {
//         "id":"default-bot",
//         "name":"Bot1"
//     },
//     "serviceUrl":"http://localhost:9002",
//     "useAuth":false
//     };
//     var notification = req.body.notification;

//     // Send notification as a proactive message
//     var msg = new builder.Message()
//         .address(address)
//         .text(notification);

//     bot.send(msg, function (err) {
//         // Return success/failure
//         res.status(err ? 699 : 200);
//         res.end();
//     });
// });

