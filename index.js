var express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser');

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Initialize the connection to the Mongodb daemon.
 *
 * @fires `mongodb:connected` on the application.
 */
var openDBConnection = function(callback) {
	var url = 'mongodb://localhost:27017/data-driven-wp';
	MongoClient.connect(url, function (err, mongoDB) {
		console.log("Connected correctly to server");
		callback(mongoDB);
	});
}

app.all( '*', function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.post('/', function (request, response, next) {
	openDBConnection(function(mongoDB) {
		mongoDB.collection('events').save(request.body, function (err, result) {});
	});
});

var server = app.listen(1337, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});
