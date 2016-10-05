var PORT = 3332;

function start(app, http) {
	app.get('/', function(req, res) {
	    res.sendFile(__dirname + "/client/index.html")
	});

	app.get('/padTutorial', function(req, res) {
	    res.sendFile(__dirname + "/client/padTutorial/index.html")
	});

	app.get('/create2Tutorial', function(req, res) {
	    res.sendFile(__dirname + "/client/create2Tutorial/index.html")
	});

	app.get('/arrowKeypad', function(req, res) {
	    res.sendFile(__dirname + "/client/arrowKeypad/index.html")
	});

	app.get('/peerReciever', function(req, res) {
	    res.sendFile(__dirname + "/client/peerReciever/index.html")
	});

	http.listen(PORT, function(){
	  console.log('Listen on ',PORT);
	});
}

exports.start = start;