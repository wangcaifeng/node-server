var util=require("util");
function Base(){
	this.name="wcf";
	this.sayhello=function(){
		console.log("hello "+this.name);
	}
}
Base.prototype.showname=function(){
	console.log(this.name);
}

function Sub(){
	this.name="miss"
}

util.inherits(Sub,Base);
var objBase=new Base();
objBase.showname();
console.log(objBase);

Base.prototype.showname();
var objSub=new Sub();

objSub.showname();
console.log(objSub);