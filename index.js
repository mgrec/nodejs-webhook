const express       = require('express');
const exec          = require('child_process').exec;
const app           = express();
const fs            = require('fs');
const client        = require('ssh2-sftp-client');
const SftpUpload    = require('sftp-upload');

var options = {
        host:'54.36.190.245',
        username:'root',
        path: 'git_temp',
        remoteDir: '/var/www/html/nodejs-wh-site',
        excludedFolders: ['**/.git', 'node_modules', '.idea'],
        exclude: ['.gitignore', '.vscode/tasks.json'],
        privateKey: fs.readFileSync('./rsa_key/ci_upload'),
        passphrase: "maxime",
        dryRun: false,
    },
    sftp = new SftpUpload(options);

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
            sftp.on('error', function(err) {
                throw err;
            })
                .on('uploading', function(progress) {
                    console.log('Uploading', progress.file);
                    console.log(progress.percent+'% completed');
                })
                .on('completed', function() {
                    console.log('Upload Completed');
                })
                .upload();
        });
    }
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});