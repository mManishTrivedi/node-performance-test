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
