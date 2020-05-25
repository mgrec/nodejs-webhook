const express       = require('express');
const exec          = require('child_process').exec;
const app           = express();
const fs            = require('fs');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

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
    let repo   = req.body.repository.html_url;
    let branch = gitCheck(req.body.ref);
    if (branch){
        exec('mkdir git_temp');
        exec('cd git_temp');
        exec('git clone -b dev '+ repo.toString() +' git_temp', (error, stdout, stderr) => {
            sftp.connect({
                host: '54.36.190.245',
                port: '22',
                username: 'root',
                password: 'E2l7ZczX'
            }).then(() => {
                return sftp.put('/var/www/html/nodejs-wh/git_temp/', '/var/www/html/nodejs-wh-site/');
                //return sftp.list('/var/www/html/nodejs-wh-site');
            }).then(data => {
                console.log(data, 'the data info');
            }).catch(err => {
                console.log(err, 'catch error');
            });
        });
    }
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});
