---
title: 以前端角度來看 oAuth，以及 oidc-client-ts 模組
description: 在公司中許多專案都有使用到 oAuth 相關的模組，例如 google, facebook, 或是接取自己公司的登入系統，但總是有些細節沒掌握好，下面會寫一些我比較不了解的地方，對於一些比較基本的就不寫了例如他的 flow, code 怎麼交換 token 等等
tags: web
---

# 以前端角度來看 oAuth，以及 oidc-client-ts 模組
在公司中許多專案都有使用到 oAuth 相關的模組，例如 google, facebook, 或是接取自己公司的登入系統，但總是有些細節沒掌握好，下面會寫一些我比較不了解的地方，對於一些比較基本的就不寫了例如他的 flow, code 怎麼交換 token 等等

## Access Token 與 ID Token 區別
在 oAuth2.0 與 OpenID Connect 中，最常見的就是 access_token 與 id_token，access_token 是用來存取資源的，而 id_token 是用來驗證使用者身份的，而這兩個 token 都是經過加密的，所以不用擔心 token 會被竊取，而且 token 也有時效性，所以不用擔心 token 會被拿去做壞事

1. id_token: 在 token 中包含使用者的身分訊息，但此 token 只用來驗證使用者身份，不能拿來獲取資源，例如 getUser 或是網站裡面的文章資料，是無法使用此 token 來驗證，而在我的過去的經驗，在製作自己的登入系統並串接如 google, facebook 登入時，當 google 登入完會返回一個 id_token, 而前端可再使用這個 token 來向後端要求一個自己的 token，而這個 token 就是 access_token

2. access_token: 在 token 中包含使用者的身分訊息，但此 token 只用來獲取資源，例如 getUser 或是網站裡面的文章資料，是無法使用此 token 來驗證，而在我的過去的經驗，在製作自己的登入系統並串接如 google, facebook 登入時，當 google 登入完會返回一個 id_token, 而前端可再使用這個 token 來向後端要求一個自己的 token，而這個 token 就是 access_token

## 前端點擊登入轉導到對應的 authorization server 做了什麼事

以 google 為例
```bash
$ curl https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=openid%20email&state=1234zyx

```

### 參數解釋

* 最前面的 url 是 google 的 authorization server url
* client_id: 你的應用程式的 client id, 用來認證你的應用程式是否有權限使用 google 的登入系統
* redirect_uri: 你的應用程式的 redirect uri，當 google 登入完會將 code 轉導到這個 url
* response_type: 這個參數的值取決於 OAuth 流程的種類。以下是一些標準的 response_type 值
    1. code: 用於授權碼授權流程（Authorization Code Grant），其中客戶端首先接收一個授權碼，然後交換獲得 Access Token
    2. token: 用於隱式授權流程（Implicit Grant），其中授權伺服器直接在重導向 URI 的片段中返回 Access Token
    3. id_token: 在 OpenID Connect（OAuth 2.0 的身份層）中使用，單獨返回一個 ID Token，用於用戶身份認證
    4. id_token token: 這個響應類型用於 OpenID Connect，同時返回 ID Token 和 Access Token
    5. none: 當帶入此參數，伺服器端會檢查會話(session)是否有認證的，如果沒有則返回登入頁面，而合法時則返回 redirect_uri，並包含原本的 state 參數
* scope: 代表你要拿什麼資料，例如 email, profile, openid 等等
* state: 防範 crsf 攻擊, 在登入後返回 redirect_uri 時會帶上這個參數，而你可以在前端將這個參數與你的後端的 state 做比對，如果不一樣就代表有人想攻擊你的系統


## OIDC 中的 PKCE 與 state 與 client_secret
1. state: 用於防範 crsf 攻擊，當你點擊登入時，會帶上 state 參數，而當登入完後，會返回 redirect_uri，而這個 redirect_uri 會帶上 state 參數，而你可以在前端將這個參數與你的後端的 state 做比對，如果不一樣就代表有人想攻擊你的系統
    * 攻擊方式: 攻擊者先登入他自己的帳號並獲取 code，並將這個 code 放置到他的釣魚網站上，當有人點擊按鈕則導向到某個應用程式的綁定，像是 leetcode，而此時 leetcode 會將那個 code 換取 access_token 並將你的帳號與受害者的帳號一同綁定，攻擊者就可以透過自己的帳號來進入你的 leetcode 帳號

2. PKCE: 主要用於手機端，因為手機端無法安全的保存 client_secret，所以使用 PKCE 來防止攻擊者竊取 code 並換取 access_token，而 PKCE 的流程如下
    1. 前端先產生一個 code_verifier，並將此 code_verifier 透過 SHA256 加密後得到 code_challenge
    2. 前端將 code_challenge 透過 base64url 編碼後傳送給後端
    



## 參考資料
1. https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html
2. https://www.zhihu.com/question/20164942/answer/2907352638