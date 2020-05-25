const express       = require('express');
const exec          = require('child_process').exec;
const app           = express();
const fs            = require('fs');
const uploader      = require('sftp-folder-upload');
const path          = require('path');

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
    let time   = Math.floor(Date.now() / 1000);
    let repo   = req.body.repository.html_url;
    let branch = gitCheck(req.body.ref);
    fs.readFile('config/nodejs-webhook.json', (err, data) => {
        if (err) throw err;
        let config = JSON.parse(data);
        console.log(config.host);
    });

    if (branch){
        exec('mkdir git_temp_' + time);
        exec('cd git_temp' + time);
        exec('git clone -b dev '+ repo.toString() +' git_temp_' + time, (error, stdout, stderr) => {
            uploader({
                server: {
                    host: '54.36.190.245',
                    port: '22',
                    username: 'root',
                    password: 'E2l7ZczX'
                },
                locationBase: path.join(__dirname, 'git_temp_' + time),
                serverBase: '/var/www/html/nodejs-wh-site/'
            }).then(allDone => {
                // Resolved When All File Uploaded
                console.log('Deploy : OK!');
                exec('cd ..');
                exec('rm -rf git_temp' + time);
            });
        });
    }
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});
