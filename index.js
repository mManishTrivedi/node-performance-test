/**
 * Created by manish on 16/12/15.
 */


var http = require('http'),
	toobusy = require('toobusy-js'),
	express = require('express');

var app = express();


//https://github.com/STRML/node-toobusy
// middleware which blocks requests when we're too busy
app.use(function(req, res, next) {
	if (toobusy()) {

		console.log("503, I'm busy right now, sorry.");
		res.send(503, "I'm busy right now, sorry." + '\n');

	} else {
		next();
	}
});


var number_of_req=0;

var server = app.listen(2000);

app.use(function (req, res) {

	for (var i=0; i<1000; i++) {
		server.on('request', function leakyfunc() {});
	}

	res.end('Hello World =====> '+ (number_of_req++) + '\n');
});


// default event listener limit is 10 and we are listing 'request' event 1000 time so make it infinity
server.setMaxListeners(0);
// htop -p  {process.pid} to track cpu and memory

console.log('Server running at http://127.0.0.1:2000/. Process PID: ', process.pid);


//generate lots of req by "while true; do curl http://127.0.0.1:2000/; done"

/**
 * ========================================== 
 * 		 memwatch-next setup and watch growth
 * ==========================================
 */
var memwatch = require('memwatch-next');
var heapdump = require('heapdump');


// utility
var util = require('util');
var hd;


memwatch.on('leak', function(info) {

	console.log('========================== Memory leak detected ======>')
	console.error(info);

	if (!hd) {
		hd = new memwatch.HeapDiff();
	} else {
		var diff = hd.end();
		console.log('======= Diff with previous snapshot  === >');
		console.error(util.inspect(diff, true, null));
		hd = null;
	}


	// Heapdump : dump into current dir
	var file = __dirname + '/myapp-' + process.pid + '-' + Date.now() + '.heapsnapshot';
	heapdump.writeSnapshot(file, function(err){
		if (err)
			console.error(err);
		else
			console.error('============= Wrote snapshot: ' + file);
	});




});



//When V8 performs a garbage collection (technically, we're talking about a full GC
// with heap compaction), memwatch will emit a stats event.

memwatch.on('stats', function(stats) {

	console.log('========================== State detected ======>')
	console.error(stats);

});
