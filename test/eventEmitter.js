var events= require("events");
var emitter=new events.EventEmitter();
function someevent(){
	console.log("someevent")
}
emitter.on("someevent",function(arg1,arg2){
	console.log("listener1",arg1,arg2);
	console.log(someevent)
});
emitter.on("someevent",function(arg1,arg2){
	console.log("listener2",arg1,arg2);
});
emitter.emit("someevent","byvoid","1990");