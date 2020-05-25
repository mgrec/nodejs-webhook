# nodejs-webhook

## How to use

 - git pull the project and run `node index.js` on your server
 - create push webhook (on github) to `http(s)://your-server:8080/deploy`
 - open `http(s)://your-server:8080/` and create a new configuration

## Config

- name (simple name)
- host (IP)
- port (Number)
- user (SSH user)
- password (SSH password)
- path_upload
- deploy_branch