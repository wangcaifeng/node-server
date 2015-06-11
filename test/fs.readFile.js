var fs=require("fs")
fs.readFileSync("content.txt","utf-8",function(err,data){
	try{
		console.log(data);
	}
	catch(err){
		console.log(err)
	}
})
fs.open("content.txt","r")