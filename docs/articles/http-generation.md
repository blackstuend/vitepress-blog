---
title: HTTP 2.0 與 HTTP 1.1 的差別
description: 第一次聽到 HTTP 2.0 的時候是因為面試時被問到什麼是 grpc，當下直接愣住了，第一次聽到這個名詞只能回答不知道，回家一查才發現是 Google 提出的新的通訊協議，而他所使用到的 HTTP 協議就是 2.0，也提到了相比於 HTTP 1.0 的諸多優點，所以才來嘗試研究
tags: web,http
---

# HTTP 2.0 與 HTTP 1.1 的差別

## HTTP 1.1 之前
HTTP 1.0 為最早的 HTTP 協議，在每一次進行請求都要跟 TCP 重新進行握手，而時常 Web 打 API 取回資料有圖片時，都是以 URL 的形式傳回，那此時就會在進行請求當圖片一多每一次都要進行的 TCP 也變的資源浪費且費時，當 HTML 裡面有大量的 JS 與 CSS 檔案也會出現此狀況

## HTTP 1.1
HTTP/1.1 發布於 1997 第一版 [RFC2068](https://datatracker.ietf.org/doc/html/rfc2068)，主要功能為繼承之前 HTTP 1.0 且解決了上述的問題，在一個 TCP 協議上可以進行多次的請求與回應，且可非同步的進行發送，但在一個 TCP 的溝通上還是需要等待上一次回應完才能接受到下一次的回應，為此每個瀏覽器的處理方式也不同，例如 chrome 會一次啟動多個 TCP 來進行連線來達到並行，而相同網域的情況下會開啟 6 個 TCP，總數為 10，當超過總數時則會將回應排進 queue 裡，而 HTTP 1.1 也新增了長連結的連線方式，也就是 keep-alive，由於有些網站的交互性與服務的較高，那 TCP 通道就會一直開著，直到設定的時間到期則會進行關閉，但當 client 端數量過多，Server 也可能會出現附載問題。另外 HTTP 1.1 也新增了快取機制，也奠定了使用至今的 RESTful API 的形式，傳輸方式多樣常使用 JSON 進行傳輸

## HTTP 2.0
HTTP 為 GOOGLE 在 2012 發布的新傳輸協議 [SPDY](https://zh.wikipedia.org/wiki/SPDY)，主要解決 HTTP 1.0 的些許問題，可以使用[測試網站](https://http2.akamai.com/demo)，來查看 1.1 與 2.0 的區別
    
1. 使用二進制傳輸
在表頭與資料都改用二進制，雖然對於人類解析並不方便，但對於電腦解析更快，相比於文本傳輸，二進制可以省下更多的 `bit`

2. 多路覆用(Multiplexing)
上述有說到 HTTP 1.1 在請求時同網域只能一次建立 6 條連線，所以有些網站會將 API 多開幾個 endpoint 以防瀏覽器的連線數到達上限，但在 HTTP 2.0 可在 TCP　發起多個請求，也可能是串流的形式，讓請求與回應可以變成雙向的

3. 頭部壓縮
為了提升效能， HTTP/2 使用一種更高級的壓縮方式 `HPACK` 算法進行頭部(header)壓縮

4. 服務推送
在 HTTP 1.1 HTML 需要一次請求 JS, CSS 或是一些靜態資源時，每一次都需要進行響應，但在 HTTP 2.0 中，當你在請求 HTML，回應時會一併將 JS,CSS 與諸多靜態資源一次傳回，也減少了請求等待中浪費的時間

## 參考資料
* [详细分析http2 和http1.1 区别](https://www.jianshu.com/p/63fe1bf5d445)
* [HTTP/2 做了什么优化？](https://xiaolincoding.com/network/2_http/http_interview.html#http-2-%E5%81%9A%E4%BA%86%E4%BB%80%E4%B9%88%E4%BC%98%E5%8C%96)
* [HTTP长连接和短连接](https://www.cnblogs.com/0201zcr/p/4694945.html)
* [Day21 X Upgrade Your HTTP Connection](https://ithelp.ithome.com.tw/articles/10278186)