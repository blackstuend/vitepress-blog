---
title: Ansible 在 Docker 上進行部屬
description: 部屬多台環境最常使用就是 ansible，但是在 gitlab-ci 中常常會使用到 docker 的 runner 來進行部屬，且不希望汙染到 runner 本身的環境，以下會介紹在 docker 上進行部屬 ansible 的作法
tags: devops
---

# Ansible 在 Docker 上進行部屬
部屬多台環境最常使用就是 ansible，但是在 gitlab-ci 中常常會使用到 docker 的 runner 來進行部屬，且不希望汙染到 runner 本身的環境，以下會介紹在 docker 上進行部屬 ansible 的作法

## Ansible Docker Image
在網路上查 Ansible Docker hub 會查到這個不知是不是[官方的連結](https://hub.docker.com/r/ansible/ansible)，但在嘗試用了會發現無法使用這個 image(根本拉不下來)，且他上一次更新版本以是 5 年前，上網查最多人推是使用 [cypotia](https://hub.docker.com/r/cytopia/ansible) 這個人的 ansible image，有非常多的版本可以選且持續在更新

## 情景
![ansible-docker](/images/ansible-docker.png)

在本地端起一個 ansible container 去進行 deploy，而此 container 可以連線到外層的 IP 來進行部屬。至於為何不再本地端直接裝 ansible，是因為在做 CICD 時，可能會使用到別人的 runner，為了避免汙染到別人的環境都會盡量以開 docker 的方式，以下會先以 ssh 帳號密碼的方式(預設為 private-key)

ansible.cfg
* 此檔案是在設定 ansible 的基礎設定，如果使用帳號與密碼需要額外設定以下參數，避免檢查 key
```
[defaults]
host_key_checking = False
```

inventory
* 設定 host map，以及他的帳號與密碼
```
[my_hosts]
host1 ansible_host=192.168.1.2 ansible_user=webteam ansible_password=webteam
host2 ansible_host=192.168.1.3 ansible_user=webteam ansible_password=webteam
```

HTMl 檔案

```
$ mkdir dist
$ echo hello > ./dist/index.html
```

playbook.yml
```yaml
- name: Deploy Dist
  hosts: my_hosts
  become: true

  tasks:
    - name: Copy files in dist folder to remote hosts
      copy: 
        src: dist/
        dest: /var/www/html/
```

dockerfile

:::tip
由於是使用帳號密碼登入，需要安裝 sshpass 才有辦法使用
:::

```dockerfile
FROM cytopia/ansible:latest-tools

RUN apk add sshpass 
COPY inventory /etc/ansible/hosts
COPY . .
COPY ansible.cfg /etc/ansible/ansible.cfg

ENTRYPOINT ["ansible-playbook", "playbook.yml"]
```

## 使用 gitlab-ci 搭配 ansible 部屬
使用 Vue 開發網站，並在推到 main 時自動啟動 gitlab ci 腳本，並將檔案上傳到部屬的環境上

情景
![ansible-gitlab.yml](/images/ansible-gitlab.png)


```yml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build-jobs:
  only:
    - main
  cache:
    paths:
      - node_modules/
    key:
      files:
        - package-lock.json
  image: node:16
  stage: build
  before_script:
    - npm install
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: "1 days"
    

deploy-jobs:
  stage: deploy
  image: cytopia/ansible:latest-tools
  only:
    - main
  before_script:
    - apk add sshpass
  script:
    - mkdir -p /etc/ansible
    - mv ./deploy/ansible.cfg /etc/ansible/ansible.cfg
    - ansible-playbook -i ./deploy/inventory ./deploy/playbook.yml
```