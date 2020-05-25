const express = require('express');
const app = express();
app.use(express.json());

function gitCheck(branch){
    if(branch == "refs/heads/dev") {
        return true;
    }
    return false;
}

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/', function (req, res) {
    console.log('new push');
    let branch = gitCheck(req.body.ref);
    console.log(branch)
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});