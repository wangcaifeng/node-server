

/*var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);*/

/*var fs=require("fs")

fs.readFile("test.js","utf-8",function(err,data){
if(err){
	console.error(err);
}else{
	console.log(data);
}

});
console.log('end')*/
/*var fs=require('fs');
var data=fs.readFileSync("test.js","utf-8");
console.log(data);
console.log("end")*/

var EventEmitter=require("events").EventEmitter;
var event=new EventEmitter;
event.on("some_event",function(){
	console.log("some_event occured")
});
setTimeout(function(){
	event.emit('some_event');
},1000)




