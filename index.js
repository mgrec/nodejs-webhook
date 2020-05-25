const express       = require('express');
const exec          = require('child_process').exec;
const app           = express();
const fs            = require('fs');
const uploader      = require('sftp-folder-upload');
const path          = require('path');
const bodyParser    = require('body-parser');

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

function gitCheck(branch){
    if(branch == "refs/heads/dev") {
        return true;
    }
    return false;
}

app.get('/', function (req, res) {
    //res.send('Hello World!')
    res.render("home.ejs");
});

app.post('/save-config', function (req, res) {
    console.log(req.body);
    let json = {"config" : {"name" : req.body.name.toString(), "host" : req.body.host.toString(), "port" : req.body.port.toString(),"user" : req.body.user.toString(), "password" : req.body.password.toString(), "path_upload" : req.body.path.toString(), "deploy_branch" : req.body.branch.toString()}};
    let jsonContent = JSON.stringify(json);

    fs.writeFile("./config/" + req.body.repo.toString()+ ".json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    });
});

app.post('/deploy', function (req, res) {

    if (req.body.repository === undefined){
        res.status(500).send('Something broke!');
        res.end();
        return false;
    }

    let time        = Math.floor(Date.now() / 1000);
    let repo        = req.body.repository.html_url;
    let repo_name   = req.body.repository.name;
    let branch      = gitCheck(req.body.ref);
    if (branch){
        exec('mkdir git_temp_' + time);
        exec('cd git_temp' + time);
        exec('git clone -b dev '+ repo.toString() +' git_temp_' + time, (error, stdout, stderr) => {
            fs.readFile('config/'+ repo_name +'.json', (err, data) => {
                if (err) throw err;
                let json = JSON.parse(data);
                let config = json.config;
                uploader({
                    server: {
                        host: config.host,
                        port: config.port,
                        username: config.user,
                        password: config.password
                    },
                    locationBase: path.join(__dirname, 'git_temp_' + time),
                    serverBase: config.path_upload
                }).then(allDone => {
                    // Resolved When All File Uploaded
                    exec('cd ..');
                    exec('rm -rf git_temp' + time);

                    console.log('Deploy : OK!');
                });
            });
        });
    }
    res.status(200)
});

app.listen(8080, function () {
    console.log('Waiting push... listening on port 8080!');
});
