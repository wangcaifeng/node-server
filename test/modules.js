var hello=function(){
	var name;
	this.setname=function(nm){
		name=nm
	};
	this.sayname=function(){
		console.log(name)
	}
};
module.exports=hello;
