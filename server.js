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
// server.post('/api/generateNecessaryIds', connector.listen());
// bot.dialog('/', function (session, results) {
//     // Serialize users address to a string.
//     var conversation_id = JSON.stringify(session.message.address.conversation.id);
//     var user_id = JSON.stringify(session.message.address.user.id);
//     var bot_id = JSON.stringify(session.message.address.bot.id);
//     var channel_id = session.message.address.channelId;
//     session.sendTyping();
//     session.send("Conversation id is %s", conversation_id);
//     session.send("User id is %s", user_id);
//     session.send("Bot id is %s", bot_id);
//     sessions.send(channel_id);
// });

server.use(restify.bodyParser());
server.post('/api/notify', function (req, res) {
    //Process posted notification
    var address = {
    // random string, doesn't really matter, but it has to be there 
    // in order for it to work
    "id":"dfefwc",
    "channelId":"emulator",
    "user":
    {},
    "conversation": {
        "id":"gg6b0clc812cj0k2f" // hardcoded for testing purpose
    },
    "bot":
    {},
    "serviceUrl":"http://192.168.0.18:9002", // this won't be needed once we transition to Skype
    };
    var notification = JSON.stringify(req.body);

    // Send notification as a proactive message
    var msg = new builder.Message()
        .address(address)
        .text(notification);

    bot.send(msg, function (err) {
        // Return success/failure
        res.status(err ? 500 : 200);
        res.end();
    });
});

