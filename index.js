var http = require('http');

var server = http.createServer(function(req, res) {
    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
    res.writeHead(200);
    res.end('Salut tout le monde !');
});
server.listen(8080);