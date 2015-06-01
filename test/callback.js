function dosomething(args,callback){
	console.log("i am number one");
	process.nextTick(callback);
};
dosomething("a",function oneEnd(){
	compute();
});
function compute(){
	console.log("i am number two");
}