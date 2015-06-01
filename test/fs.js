var fs=require('fs');

// fs.readFile('zj.txt','utf-8',function(err,data){
//           if(err){
//               console.log(err);
//           }else{
//               console.log(data);
//           }
//       })
     fs.open('zj.txt','r',function(err,fd){
         if(err){
             console.error(err);
             return;
         }
         console.log(fd)
         var buf=new Buffer(10);
         fs.read(fd,buf,0,10,null,function(err,bytesRead,buffer){
             if(err){
                 console.error(err);
                 return;
             }
             console.log('bytesRead '+bytesRead);
             console.log(buffer);
         });
     });