/*var http = require('http');

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
*/

const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/', function (req, res) {
    console.log('new push');
    console.log(req.body);
    //res.send('Hello World!')
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});