const express   = require('express');
const exec      = require('child_process').exec;
const app       = express();

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
    let repo   = req.body.html_url;
    let branch = gitCheck(req.body.ref);
    if (branch){
        exec('mkdir git_temp');
        exec('cd git_temp');
        exec('git clone -b dev '+ repo.toString() +' git_temp')
    }
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});