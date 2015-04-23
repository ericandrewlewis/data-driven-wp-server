require('newrelic');
var express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser')
	dbConnection = null;

// Use Jade as the templating engine alongside Express.
app.set('view engine', 'jade');
app.set('views', './views');

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Get the db connection and run the specified callback.
 *
 * @param {callback} Callback to be invoked.
 */
var db = function(callback) {
	if (dbConnection) {
		callback(dbConnection);
		return;
	}
	var url = 'mongodb://localhost:27017/data-driven-wp';
	MongoClient.connect(url, function (err, mongo) {
		console.log('Connected to mongo.');
		dbConnection = mongo;
		callback(dbConnection);
	});
}

/**
 * Add proper CORS headers to allow endpoints to be accessed in browsers over AJAX.
 */
app.all( '*', function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

/**
 * GET handler for displaying user data.
 */
app.get('/', function (request, response) {
	// At least some privacy.
	if ( typeof request.query.opensesame === 'undefined' ) {
		response.status(403).send('You did not say the magic word.');
		return;
	}
	db(function(mongo){
		mongo.collection('events').find().limit(100).toArray(function(err,events) {
			response.render('index', {
				schema: [ 'mongo uid', 'event', 'user uid', 'width', 'height', 'ua', 'touchenabled' ],
				events: events
			});
		});
	});
});


/**
 * POST handler for saving user data.
 */
app.post('/', function (request, response, next) {
	response.status(200).send();
	db(function(mongo) {
		mongo.collection('events').save(request.body, function (err, result) {});
	});
});

/**
 * Listen for incoming requests.
 */
var server = app.listen(1337, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on http://%s:%s', host, port);
});
