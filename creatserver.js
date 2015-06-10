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
   

var CONF = [
  {
    path : "",
    port : 2850,
    agent : "xuan.news.cn"
  },
  {
    path : "D:\\mobile\\",
    port : 8888,
    agent : "xuan.news.cn"
  },
   {
    path : "C:\\Users\\piaozai\\Desktop\\buzhangzhisheng",
    port : 8090,
    agent : "xuan.news.cn"
  }
]
function start(conf){
  var server = http.createServer(function(req,resp){
      var root = conf.path||__dirname+'/';//creatserver.js所在dirname目录
          pathname = url.parse(req.url).pathname;
      try{pathurl = decodeURI(url.parse(req.url).pathname); }catch(e){ pathurl = req.url; }
      var pathname = (pathurl === '/') ? (root) : root + pathurl;  //根目录时，追加welcome页面
          req.data =querystring.parse(url.parse(req.url).query);
          req.$ = {title: pathurl, fileList: [], util:'http://127.0.0.1:2850/',root:root};
          var DEBUG = req.data.debug === "true"
      fs.stat(pathname, function(error, stats){
        if(error){
          if(!fs.existsSync(pathname)){
            var cookies = {};
            headers = {   //拼接headers数据，只处理必要的
               "user-agent": req.headers["user-agent"]|| "f2eBrowser",
               "content-type": req.headers["content-type"] || "text/html",
                cookie: cookies['xuan.news.cn']|| "",
                host: 'xuan.news.cn',
                accept: req.headers.accept || "*"
              };
            var param={
                host:'xuan.news.cn',
                port:'80',
                path: url.parse(req.url).path,
                method: req.method,
                headers:headers
            }

            if(req.method == 'POST'){
              param.headers['content-length'] = req.headers["content-length"];
            }

            var reqs= http.request(param,function(res){
              var ck = res.headers["set-cookie"],
                  hck = cookies['xuan.news.cn'];
                  console.log( res.headers["set-cookie"])
              if(ck){ // 远程cookie同步
                [].slice.call(ck).forEach(function(item){
                  var m = item.split(";")[0],
                      key = m.split("=")[0],
                      reg = new RegExp('\\b' + key + '=[^;]*');
                  if( reg.test(hck) ){
                    hck = hck.replace(reg,m);
                  }else{
                    hck += ";" + m;
                  }
                });
                cookies['xuan.news.cn'] = hck;
              }
              if( res.statusCode === 302 ){ // 对于远程服务的302转发中的域名部分修改成本地域名
                res.headers.location = res.headers.location.replace( /(https?:\/\/)[^\\\/]+/, "http://" + req.headers.host );
              }
              resp.writeHead(res.statusCode, res.headers);
              res.pipe(resp);
            }).on('error', function(e) {
                  resp.writeHead(500, {"Content-Type": "text/html"});
                  resp.end( e.stack.toString().replace(/\n/g,"<br>") );
            })
            req.on('data', function(chunk) {
              reqs.write( chunk );  //提交POST数据
            }).on('end', function() {
              reqs.end();
            });
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

