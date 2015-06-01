mime.isTXT = function(path){
  return /\b(text|xml|javascript|json)\b/.test( this.lookup(path) );
};
if( mime.isTXT(pathname) ){
  rs.on("end",function(){    
      str = require("./lib/common/handle.js").execute(str, root);  //将处理过程用一个新的模块实现
      resp.end( str );
  });
}else{
  rs.pipe(resp);
}