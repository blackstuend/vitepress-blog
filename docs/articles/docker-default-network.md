---
title: Docker default network ip 
description: Docker default network, we know the prefix ip is 172.16.xxx.xxx, but sometimes I deploy the docker service, ip will be 192.168.xxx.xxx, and if occur this situation, the router or switch will get confuse, and network will be crash
tags: devops
---

# Docker default network ip 
Docker default network, we know the prefix ip is 172.16.xxx.xxx, but sometimes I deploy the docker service, ip will be 192.168.xxx.xxx, and if occur this situation, the router or switch will get confuse, and network will be crash

## How to set the default docker network

```bash
$ sudo vim /etc/docker/daemon.json
```

```json
{
  "bip": "172.16.0.1/16"
}
```

Restart the docker service
```
$ sudo systemctl restart docker
```

After you run the docker compose or directly run docker, the ip always be 172.16.xx.xx

## Reference
* https://support.hyperglance.com/knowledge/changing-the-default-docker-subnet