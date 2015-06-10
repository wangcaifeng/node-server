var mime = require("mime"),    //MIME类型
    fs = require("fs"),
    path = require('path'),
    url = require('url'),
    formidable = require('formidable'),
    handle=require("./../common/handle.js");
var uploadModel = path.join( __dirname, "/../html/uploadOK.html");
exports.execute = function (req,resp,root,pathname,pathurl,__dirname) {
	resp.writeHead(200,{
      'Content-Type':mime.lookup(pathname) || 'text/html'
    });
    var form = new formidable.IncomingForm(); 
    var  files = [],
         fields = {};
    form.uploadDir = root+'/tmp/';  //文件上传 临时文件存放路径 
    form.on('field',function(name, value){
      fields[name] = value;
    }).on('file', function(field, file) {
        if( file.size ){
            files.push({name: field, file: file});
        }
    }).on('end',function(){
		if(files.length){
			files.map(function(file){
	            fs.rename(file.file.path, form.uploadDir + file.file.name, function (err) {
	                if(err){ throw err; }
	            });
	        });
		}
		fs.readFile(pathname, function(err, data){
		    if(err){
		        throw err;
		    }
		    resp.writeHead(200, {'content-type':  mime.lookup(pathname)});
		    req.forward = true;
            req.files=files;
		    handle.execute(data.toString(), root, req, resp)
		});
     
    })
    form.parse(req);
}