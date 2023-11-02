---
title: Deploy to remote server by gitlab use scp or ssh
description: gitlab-ci is very easy tool to do the "CI" or "CD", in the below I will introduction the very easy way let us can use the ssh or scp to deploy to remote server
tags: devops
---

# Deploy to remote server by gitlab use scp or ssh
gitlab-ci is very easy tool to do the "CI" or "CD", in the below I will introduction the very easy way let us can use the ssh or scp to deploy to remote server

## Introduction
* I will use the very simple vue project to demo how to deploy to remote server

## Folder Structure

```md
- public
- src
    - main.ts
    - App.vue
- package.json
- test
    - unit
        - example.spec.ts
- .gitlab-ci.yml
- vite.config.ts
```

## Set the ssh key
Set the ssh key in your local machine, and copy the public key to remote server

* Generate the ssh key
```bash
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/username/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

* Upload the public key to remote server

```bash
$ ssh-copy-id username@server_host
```

## Set the ssh to gitlab variable
* Go to gitlab project setting
* Go to CI/CD -> Variables
* Add the variable
    * Name: SSH_PRIVATE_KEY
    * Value: Paste the private key

## Set the gitlab-ci.yml

```yml
image: node:16

stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test-job:
  stage: test
  before_script:
    - npm install
  script:
    - npm run test-unit

build-job:
  stage: build
  before_script:
    - npm install
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: "1 days"

deploy-job:
  stage: deploy
  before_script:
    # set ssh don't need key
    - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 700 ~/.ssh/id_rsa
    - eval "$(ssh-agent -s)"
    - ssh-add ~/.ssh/id_rsa
    - echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
    - npm install --legacy-peer-deps
  script:
    - scp -r ./dist/* root@192.168.1.1:/var/www/html
```

In the above, the important is the deploy-job, take care about before_script, it will set the ssh key, and the script will use scp to upload the dist folder to remote server

## Run the docker with sudo
Sometimes I wil deploy the docker service, and I will write the script with sudo,for example ssh -t server@192.168.1.1 "sudo docker ps", it will demand you input the password, even though you already set ssh-key in the remote server, so you can flow the below step to solve this problem

```
$ sudo cat sudoers
#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
# See the man page for details on how to write a sudoers file.
#
Defaults        env_reset
Defaults        mail_badpass
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"

# Host alias specification

# User alias specification

# Cmnd alias specification

# User privilege specification
root    ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "#include" directives:

#includedir /etc/sudoers.d
```
In the above file, you can see the last line, it will include the /etc/sudoers.d folder, so you can create the file in this folder, and you can't directly modify this file, because this file only root user can modify, but you still can create the file in /etc/sudoers.d folder, and you can modify this file


```bash
$ sudo vim /etc/sudoers.d/{fileName}

{userName} ALL=(ALL) NOPASSWD: ALL
```

Change {userName} to your username, and save the file, and you can use ssh -t with sudo script and without password
