var express = require('express'),
    app = express();

app.set('port', (process.env.PORT || 3322));

app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/client/index.html")
});

app.get('/padTutorial', function(req, res) {
    res.sendFile(__dirname + "/client/padTutorial/index.html")
});

app.get('/create2Tutorial', function(req, res) {
    res.sendFile(__dirname + "/client/create2Tutorial/index.html")
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});