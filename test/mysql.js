var mysql= require('mysql')
var conn = mysql.createConnection({
    host: 'localhost',//数据库服务主机名或ip(mysql安装的ip)
    user: 'root', // 数据库服务主机用户名(mysql安装的名称)
    password: '123456', //数据库服务主机用户密码（mysql安装的名称）
    database:'test', //数据库
    port: 3306//服务端口
});

var line =3;
console.log(line);
var insertSQL = 'insert into user(id, name) values('+line+',"conan")';
var selectSQL = 'select * from user limit 10';
var deleteSQL = 'delete from t_user';
var updateSQL = 'update user set name="idset"  where id=1';
conn.connect(function(error, results){
   if(error) {
    console.log('Connection Error: ' + error.message);
    return;
  }
  conn.query('select * from user', function(error, results) {
      if(error) {
          console.log('ClientConnectionReady Error: ' + error.message);
          conn.end();
          return;
      }
      conn.query(insertSQL, function(error, results){
        if(error) {
          console.log('ClientConnectionReady Error: ' + error.message);
          conn.end();
          return;
        }
        line++;
      });
      conn.query(updateSQL, function(error, results){
        if(error) {
          console.log('ClientConnectionReady Error: ' + error.message);
          conn.end();
          return;
        }
        line++;
      });
      conn.query(selectSQL, function(error, results){
        console.log(results)
        if(error) {
          console.log('ClientConnectionReady Error: ' + error.message);
          conn.end();
          return;
        }
        line++;
      })
  });
});
