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
server.post('/api/notify/:channel/:conversation_id', function (req, res) {
    //Process posted notification
    var address = {
    // random string, doesn't really matter, but it has to be there 
    // in order for it to work
    "id": Math.random().toString(36).substr(3, 8),
    "channelId": req.params.channel,
    "user":
    {},
    "conversation": {
        "id": req.params.conversation_id // hardcoded for testing purpose
    },
    "bot":
    {},
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