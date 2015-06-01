var mime = require("mime"),    //MIME类型
    http = require("http"),
    fs = require("fs"),
    _ = require('underscore'),
    url = require('url'),
    formidable = require('formidable'),
    handle=require("./lib/common/handle.js"),
    less=require('less'),
    querystring = require("querystring");
    var path = require('path');
    less.render('.class { width: (1 + 1) }', function (e, css) {
      console.log(css);
    });

var CONF = [
  {
    path : "",
    port : 2850
  },
  {
    path : "D:\\mobile\\",
    port : 8888
  }
]
function start(conf){
  var server = http.createServer(function(req,resp){

    //console.log(__dirname)
      var root = conf.path||__dirname+'/';//creatserver.js所在dirname目录
      //console.log(url.parse(req.url,true))
          pathname = url.parse(req.url).pathname;
          //console.log(url.parse(req.url).pathname)
      try{pathurl = decodeURI(url.parse(req.url).pathname); }catch(e){ pathurl = req.url; }
      var pathname = (pathurl === '/') ? (root) : root + pathurl;  //根目录时，追加welcome页面
          req.data =querystring.parse(url.parse(req.url).query);
         // console.log(url.parse(req.url))
         // console.log(querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' }))
          req.$ = {title: pathurl, fileList: [], util:'http://127.0.0.1:2850/',root:root};
          var DEBUG = req.data.debug === "true"
      fs.stat(pathname, function(error, stats){
        if(error){
          if(!fs.existsSync(pathname)){
            var creats = fs.mkdirSync('cloudc', 0777);

           // console.log(pathname)
            //fws = fs.createWriteStream(pathname);
            
          }
        }else if(!error&& stats && stats.isDirectory && stats.isDirectory()){
              var folder = path.join( __dirname , "lib/tmpl/folder.html" );
              require('./lib/filter/directory').execute(req,resp,root,pathname,pathurl,__dirname);
        }else if(!error && stats && stats.isFile && stats.isFile() ){
          if(req.method == 'POST'){

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
             //console.log(files)
               files.map(function(file){
                    fs.rename(file.file.path, form.uploadDir + file.file.name, function (err) {
                        if(err){ throw err; }
                    });
                });
             fs.readFile(pathname, function(err, data){
                  if(err){
                      throw err;
                  }
                  resp.writeHead(200, {'content-type':  mime.lookup(pathname)});
                  req.forward = true;
                  require("./lib/common/handle.js").execute(data.toString(), root, req.$, resp)
              });
             
            })
            form.parse(req);
            /*var rs =fs.createReadStream(pathname), str = '';
            rs.on('error',function(err){
              resp.writeHead(500,{'Content-Type' : 'text/html'});
              resp.end(JSON.stringify(err))
            }).on('data',function(d){
              rs += d;
            }).on('end',function(){
             resp.end(rs)
            })*/

          }else{
              resp.writeHead(200, {
                  "Content-Type": mime.lookup(pathname) || 'text/html'
              });
              var rs = fs.createReadStream(pathname), str = "";
              rs.on("error", function(err){  
                resp.writeHead(500, {"Content-Type": 'text/html'});
                resp.end( JSON.stringify(err) );  //出错时 服务端给出500的HTTP-code
              }).on("data", function(d){  //data事件中拼接结果
                str += d;
              }).on("end", function(){
                //TODO 这里获取str就是结果字符串
              });


              

              mime.isTXT = function(path){
                return /\b(text|xml|javascript|json)\b/.test( this.lookup(path) );
              };
              if( mime.isTXT(pathname) ){
                rs.on("end",function(){    
                  handle.execute(str, root, req.$, resp);  //将处理过程用一个新的模块实现
                });
              }else{

                rs.pipe(resp);
              }
            }
          }else{
              resp.writeHead(404, {
                  "Content-Type": 'text/html'
              });
              resp.end("404");
          }
      });
  });
  server.listen(conf.port);
    return server;
}
var ports = {};
for(var k in CONF){
    (function(c){
        if(ports[c.port]){return;}
        ports[c.port] = start(c);
    })(CONF[k]);
    console.log("Server running at http://127.0.0.1:" + CONF[k].port + '\t[' + k + ']');
}

