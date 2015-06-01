var fs=require("fs");
var rs=fs.createReadStream("testdata.md",{bufferSize:11});
var data="";
rs.on("data",function(trunk){
	data+=trunk;
});
rs.on("end",function(){
	console.log(data)
})