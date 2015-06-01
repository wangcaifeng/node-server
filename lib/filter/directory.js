"use strict";
var fs = require('fs'),
    mime = require('mime');
var path = require('path');
var handle = require("./../common/handle.js");
var fs = require("fs"),
   _ = require("underscore");
exports.execute = function(req, resp, root, pathname, pathurl,localpath){
    pathurl = pathurl.lastIndexOf('/') === pathurl.length - 1 ? pathurl : pathurl + "/";
    var type = req.data.type || "html";
    fs.readdir(pathname, function(error, files){
        // var urlSplit; = pathurl.split("/"), list = [];
        // if(urlSplit.length > 1){urlSplit.length -= 2;}else{urlSplit[0] = "..";}
        var reg =/\.([^\.\/]+)$/;
        for ( var i in files) {  
              //对应下级目录或资源文件
            req.$.fileList.push({
                href: encodeURI( pathurl + files[i] ),
                file: files[i],
                base:pathurl,
                type : reg.test(files[i])
               
            });
        }
        var compiled = _.template( fs.readFileSync( __dirname + '/../html/folder.html','utf-8') );
        resp.writeHead(200, {"Content-Type" : "text/html" });
        var str= compiled(req.$); 
        resp.end( str );
        return;



       /* switch(req.data.type){
            case 'json':resp.end( JSON.stringify( files ) ); break;
            case 'jsonp':resp.end( (req.data.callback || 'callback') + '(' + JSON.stringify( files ) + ')' );break;
            case undefined:
            var folder = path.join( __dirname , "/../tmpl/folder.html" );
                try{
                    //console.log(1);
                    var data = fs.readFileSync(folder,'utf-8');
                    return handle.execute(data.toString(),root,req,resp);
                    return;
                }catch(e){
                    if(folder){console.log(e);}else{
                        req.$.fileList.map(function(item){
                            list.push( '<p><a href="' + item.href + '">' + item.name + '</a></p>' );
                        });
                        resp.end( '<div>' + list.join('') + '</div>' );
                    }
                }
                break;
            case 'xml':
                req.$.fileList.map(function(item){
                    list.push( '<p><a href="' + item.href + '">' + item.name + '</a></p>' );
                });
                resp.end( '<div>' + list.join('') + '</div>' );
        }*/
    });
};
