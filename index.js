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
    let repo   = req.body.repository.html_url;
    let branch = gitCheck(req.body.ref);
    if (branch){
        exec('mkdir git_temp');
        exec('cd git_temp');
        exec('git clone -b dev '+ repo.toString() +' git_temp', (error, stdout, stderr) => {
            uploader({
                server: {
                    host: '54.36.190.245',
                    port: '22',
                    username: 'root',
                    password: 'E2l7ZczX'
                },
                // The Foloder You Want To Upload
                locationBase: path.join(__dirname, 'git_temp'),
                // The Destination Of Uploading
                serverBase: '/var/www/html/nodejs-wh-site/'
            }).then(allDone => {
                // Resolved When All File Uploaded
                console.log('OK All Uploaded');
                exec('cd ..');
                exec('rm -rf git_temp');
            });
        });
    }
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});
