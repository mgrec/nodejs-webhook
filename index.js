const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/', function (req, res) {
    console.log('new push');
    console.log(req.body.ref);
    //console.log(req.body);
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});