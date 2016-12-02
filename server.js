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

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

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
    var request = JSON.parse(req.body);
    var username = request.username; 
    var title = request.attachments[0].title;
    var title_link = request.attachments[0].title_link;
    var pre_text = request.attachments[0].pretext;

    var msg = new builder.Message()
        .address(address)
        .text("**" + username + "**" + "\n\n" 
        + pre_text + "\n\n" 
        + "[" + title + "]" + "(" + title_link + ")" + "\n\n"
        )

    bot.send(msg, function (err) {
        // Return success/failure
        res.status(err ? 500 : 200);
        res.end();
    });
});

server.post('/api/messages', connector.listen());
bot.dialog('/', function (session, results) {
     // Serialize users address to a string.
     var conversation_id = session.message.address.conversation.id;
     var channel_id = session.message.address.channelId;
     var webhook_url = "http://reviewboardbot.azurewebsites.net/api/notify/" + channel_id + "/" + conversation_id 
     session.sendTyping();
     session.send("Your bot webhook URL is: " + webhook_url);
 });