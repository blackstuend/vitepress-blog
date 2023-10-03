---
title: Windows Remote to Powershell occur 401 Unauthorized
description: When I want to use the python tool([pywinrm](https://pypi.org/project/pywinrm/)) to check the server still alive, and check server still can connect, but I got the error message `401 Unauthorized`.
tags: devops
---


# Windows Remote to Powershell occur 401 Unauthorized
When I want to use the python tool([pywinrm](https://pypi.org/project/pywinrm/)) to check the server still alive, and check server still can connect, but I got the error message `401 Unauthorized`.


## Script
```python
import winrm

windows_host = "http://192.168.1.1:5985/wsman"
username = "administrator"
password = "password"
session = winrm.Session(windows_host, auth=(username, password))
result = session.run_ps("$env:COMPUTERNAME")
```


## Reason
Because I use the http protocol to connect the server, but the server default is using https protocol, so I need to change the protocol to https.

## Solution
Open the powershell on server, input the above command to update the settings, make it can accept the http protocol.

* Check the settings
You will see the `AllowUnencrypted` and `auth\Basic` is false, represent the server not allow the http protocol.

```powershell
$ winrm get winrm/config
Config
    MaxEnvelopeSizekb = 500
    MaxTimeoutms = 60000
    MaxBatchItems = 32000
    MaxProviderRequests = 4294967295
    Client
        NetworkDelayms = 5000
        URLPrefix = wsman
        AllowUnencrypted = false
        Auth
            Basic = true
            Digest = true
            Kerberos = true
            Negotiate = true
            Certificate = true
            CredSSP = false
        DefaultPorts
            HTTP = 5985
            HTTPS = 5986
        TrustedHosts = *
    Service
        RootSDDL = O:NSG:BAD:P(A;;GA;;;BA)(A;;GR;;;IU)S:P(AU;FA;GA;;;WD)(AU;SA;GXGW;;;WD)
        MaxConcurrentOperations = 4294967295
        MaxConcurrentOperationsPerUser = 1500
        EnumerationTimeoutms = 240000
        MaxConnections = 300
        MaxPacketRetrievalTimeSeconds = 120
        AllowUnencrypted = false
        Auth
            Basic = false
            Kerberos = true
            Negotiate = true
            Certificate = false
            CredSSP = false
            CbtHardeningLevel = Relaxed
        DefaultPorts
            HTTP = 5985
            HTTPS = 5986
        IPv4Filter = *
        IPv6Filter = *
        EnableCompatibilityHttpListener = false
        EnableCompatibilityHttpsListener = false
        CertificateThumbprint
        AllowRemoteAccess = true
    Winrs
        AllowRemoteShellAccess = true
        IdleTimeout = 7200000
        MaxConcurrentUsers = 2147483647
        MaxShellRunTime = 2147483647
        MaxProcessesPerShell = 2147483647
        MaxMemoryPerShellMB = 2147483647
        MaxShellsPerUser = 2147483647
```

* Update the settings

```powershell
$ set-item wsman:\localhost\service\AllowUnencrypted -value true
$ set-item wsman:\localhost\service\auth\Basic -value true
```


## Reference
1. https://docs.microfocus.com/doc/Operations_Orchestration/2023.05/PowerShellWizardRemoting