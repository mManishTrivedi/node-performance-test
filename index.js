/**
 * Created by manish on 16/12/15.
 */


var http = require('http');
var number_of_req=0;

var server = http.createServer(function (req, res) {
	for (var i=0; i<1000; i++) {
		server.on('request', function leakyfunc() {});
	}

	res.end('Hello World =====> '+ (number_of_req++) + '\n');
}).listen(2000, '127.0.0.1');
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


//memwatch.on('leak', function(info) {
//	console.error('Memory leak detected: ', info);
//});


var hd;
var util = require('util');
memwatch.on('leak', function(info) {

	console.log('========================== Memory leak detected ======>' + '\n')
	console.error(info);

	if (!hd) {
		hd = new memwatch.HeapDiff();
	} else {
		var diff = hd.end();
		console.log('======= Diff with previous snapshot  === >');
		console.error(util.inspect(diff, true, null));
		hd = null;
	}
});