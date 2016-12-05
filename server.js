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
server.post('/api/notify/:encodedAddress', function (req, res) {
    // Convert the address in the webhook's URL into JSON 
    var decodedAddress = 
        new Buffer(req.params.encodedAddress, 'base64').toString('ascii');
    var address = JSON.parse(decodedAddress);

    // Body of notification
    var request = JSON.parse(req.body);
    var username = request.username;
    var title = request.attachments[0].title;
    var titleLink = request.attachments[0].title_link;
    var preText = request.attachments[0].pretext;

    // Construct the message with address and text for the bot
    var msg = new builder.Message()
        .address(address)
        .text(`**${username}**\n\n${preText}\n\n[${title}](${titleLink})`);

    bot.send(msg, function (err) {
        // Return success/failure status code
        res.status(err ? 500 : 200);
        if (err) {
            console.log(JSON.stringify(err));
        }
        res.end();
    });
});

server.post('/api/messages', connector.listen());
bot.dialog('/', function (session, results) {
    // Serialize user's address JSON object into a base64 string.
    var address = JSON.stringify(session.message.address);
    var encodedAddress = new Buffer(address).toString('base64');
    var domainName = server.url;
    var webhook_url = 
        `${domainName}/api/notify/${encodedAddress}`;
    session.sendTyping();
    session.send(`Your bot webhook URL is: ${webhook_url}`);
});
