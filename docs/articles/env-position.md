---
title: env 環境檔到底該不改上 git
description: 在開發時我們會設定 本地端(local), 測試站(dev), 上線前測試站(staging), 正式站(production) 這幾組環境，代表上線時也就會設定對應的環境檔案，例如 .env 對應 本地， .env.dev 對應 測試站 ...等等，但 env 時常會放著各個環境設定與又或是密鑰那這些檔案是否該上 git 又是否會被截取走，以下歸類幾種方式才做參考是否該放 .env
tags: nodejs
---

# .env 環境檔到底該不改上 git
在開發時我們會設定 本地端(local), 測試站(dev), 上線前測試站(staging), 正式站(production) 這幾組環境，代表上線時也就會設定對應的環境檔案，例如 .env 對應 本地， .env.dev 對應 測試站 ...等等，但 env 時常會放著各個環境設定與又或是密鑰那這些檔案是否該上 git 又是否會被截取走，以下歸類幾種方式才做參考是否該放 .env

## 是否是開源的項目
公開項目的環境檔案，由於大家都可以閱覽，故很明顯就不該放密碼或是 token 等等機密的內容，沒有人會希望自己的密碼與別人是公開的吧。

有些人會寫多新增一個 .env.example 去告訴別人怎麼去新增自己的 .env 檔案，例如在裡面寫 PASSWORD={YOUR_PASSWORD}，就可以很清楚讓對方知道該怎麼去更新裡面的內容。

如果是私有的項目，我個人認為是認為不需要特別去避免被看，裡面的 dev 或是 staging 環境都是機台上面的設定，讓開發者可以在 git 裡面就可以看到，對於機器上面的設定也會比較清楚

## .env 本地端是否有客製化的設定
如果本地端的變量是為了便利開發便利而將密碼或是金鑰寫上去，又或是將本機的路徑寫上去，會導致在別人的環境上無法開發的這種就沒必要寫入，但如果是共用的資料如 API 的導向路徑等等是沒問題的。

## 是否含有敏感訊息
如果是前端項目例如 vue react 都會使用到 webpack 進行編譯，編譯時會將 env 裡面的資料全部寫進去，故在 env 自然是不能放一些敏感訊息，但像是 firebase token 或是 api 打的路徑理，這一些本身就是用戶端會用到的資料，公開出來本身就沒什麼關係。

但如果是後端項目，例如寫到 SQL 的密碼，或是測試帳號密碼，這一種訊息保存在機器上會更加安全，而後端項目時常也部屬在雲端上，這一些環境設定本身就在雲端的設定更多是不需要自己的環境檔案。

## 總結
每一個的開發習慣都不同，要怎麼放其實也是在於開發者怎麼看待這件事，有些人認為環境檔就應該只存在個別的環境，你要在那環境時就去那各別設定，有些人喜歡將環境都歸類在一起，藉由環境檔就可以了解所有機台上的環境，也可以在本機試著跑其他環境的設定來做測試，我認為沒有對與錯，只要能夠順利開發敏感資訊不外洩就沒什麼問題

## 參考
* https://www.v2ex.com/t/661188
* https://salferrarello.com/add-env-to-gitignore/
