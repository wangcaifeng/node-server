var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello miss wang");
  response.end("bey-bey");
}).listen(8000);