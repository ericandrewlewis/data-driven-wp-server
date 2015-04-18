var express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser')
	dbConnection = null;

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Get the db connection and run the specified callback.
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

app.all( '*', function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.post('/', function (request, response, next) {
	response.status(200).send();
	db(function(mongo) {
		mongo.collection('events').save(request.body, function (err, result) {});
	});
});

var server = app.listen(1337, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});
