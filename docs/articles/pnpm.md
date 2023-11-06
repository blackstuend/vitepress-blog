---
title: 為何從 npm 改成 pnpm
description: 從開始學 node.js，就一直使用 npm 或是 yarn，但在最近越來越多人使用 pnpm 在了解了他與 npm 的區別之後，我也開始使用 pnpm 了，以下會說明 npm 與 pnpm 最大的區別，以及他為何比 npm 快
tags: frontend
---

# 為何從 npm 改成 pnpm
從開始學 node.js，就一直使用 npm 或是 yarn，但在最近越來越多人使用 pnpm 在了解了他與 npm 的區別之後，我也開始使用 pnpm 了，以下會說明 npm 與 pnpm 最大的區別，以及他為何比 npm 快

## 安裝
npm 需要 16 版本以上才可使用 pnpm

```
$ npm install pnpm -g
```

## 常用指令
基本上跟 yarn 都滿相似，安裝上變成 add, 執行時省略 run

```bash
# 與 npm install 相同
$ pnpm install
# 與 npm install --save 相同
$ pnpm add <package>
# 與 npm install --save-dev 相同
$ pnpm add -D <package>
# 與 npm run dev 相同
$ pnpm dev
```

## 為何比 npm 快
在說明為何比 npm 快之前須先了解 npm 的資料夾發展史

### Npm v3 之前
資料夾結構，是使用巢狀的在一個 dependency，跟著 package.json 的設置，會有一個 node_modules 資料夾，裡面會有所有的 dependency，但如果有相依的 dependency，會在裡面再建立一個 node_modules，但這樣會也造成資料夾很大，且會有許多重複的 dependency，如下圖的資料夾結構

```markdown
- package.json
- package-lock.json
- node_modules
    - express
        - package.json
        - node_modules
            - inherits
                - node_modules
                    - ...
            - mime
            - ...
```

### Npm V3 之後
將所有的 dependency 都扁平化了，全都放在一個 node_modules 資料夾，而且會在裡面建立一個 .bin 資料夾，裡面會放所有的執行檔，如下圖的資料夾結構，解決了許多重複的 dependency 的問題，但是當專案數量多起來時還是會導致浪費大量空間
```markdown
- package.json
- package-lock.json
- node_modules
    - .bin
    - express
        - package.json
    - inherits
    - mime
    - ...
```

::: info
而當如果 dependency 與其他 dependency 都用到同一個套件時，但裡面的版本不同， npm 會將最新的版本放到 node_modules 上層，而舊的會以巢狀的方式在 dependency 的 node_modules，所以當版本過多時可能會導致 node_modules 過深而導致過於複雜與速度減慢
:::

### pnpm 的作法
採用以下的資料夾結構

```markdown
- node_modules
    - .modules.yaml
    - .pnpm
        - express
        - inherits
        - mime
        - ...
    - express
```

::: info
可以看到 node_modules 變得乾淨許多，第一層只出現一個 express 的資料夾，且 ls -al 看一下資料夾結構，可以看到下方的 express 使用軟連結，連結至 .pnpm/express@4.18.2/node_modules/express，解決了重複的 dependency 問題，且在 .pnpm 裡面會將不同版本的 dependency 都放在不同的資料夾，也解決了相同套件不能版本導致巢狀過深問題
:::

```bash
$ ls -al
total 16
drwxr-xr-x 1 user1 197121    0 Nov  3 17:31 ./
drwxr-xr-x 1 user1 197121    0 Nov  3 17:32 ../
-rw-r--r-- 1 user1 197121 3144 Nov  3 17:31 .modules.yaml
drwxr-xr-x 1 user1 197121    0 Nov  3 17:31 .pnpm/
lrwxrwxrwx 1 user1 197121   66 Nov  3 17:31 express -> '/d/test/node_modules/.pnpm/express@4.18.2/node_modules/express/'/
```

* 雖上述以可提升許多安裝速度，但 pnpm 還有快取功能會將以前安裝過的都放置到快取的位置中

### 查看 pnpm 快取的路徑
前去查看 store 的路徑，可以看到下方一堆亂碼，在進入隨便一個資料夾可看到許多被 hash 過的檔案，那些都是我們的原始 node_modules 的 資料，而 pnpm 會將之前所有下載過的 package 都放置在這裡，再使用硬連結的方式放置對應的資料夾下，而不用像 npm 都是使用複製的方式，可以更加快速，且統一管理不會每一開一個專案都增加一次 node_modules 的大小

```bash
$ pnpm store path
D:\.pnpm-store\v3
$ cd D:\.pnpm-store\v3\files
$ ls -al
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 ee/
drwxr-xr-x 1 user1 197121 0 Nov  3 17:31 ef/
drwxr-xr-x 1 user1 197121 0 Nov  3 17:31 f0/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f1/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f2/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f3/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f4/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f5/
drwxr-xr-x 1 user1 197121 0 Nov  3 17:31 f6/
drwxr-xr-x 1 user1 197121 0 Nov  3 17:31 f7/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f8/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 f9/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 fa/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 fb/
drwxr-xr-x 1 user1 197121 0 Nov  3 17:31 fc/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 fd/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 fe/
drwxr-xr-x 1 user1 197121 0 Nov  3 16:54 ff/

$ cd ff/
$ ls -al
-rw-r--r-- 1 user1 197121    547 Nov  3 16:52 00bb30e8ffda5e54417eb443b3d01c822588f5c18315ff1e2dcab30fa91a94d1a3ad4edb2999d71df4b8e6e9b02b93a8d1f952fda1963e3818364c46b6f00d
-rw-r--r-- 1 user1 197121     80 Nov  3 16:52 00c8a1f4f773fab6654f43ce8e92eaa27309bcb2a34b28dc9fbd240e42c278906956f8cfe69c11c02477f5b7ef338ff066e1c2f81d939826d44c778a561c9d
```

* 如要檢驗是否有使用到硬連結，可透過 CMD 輸入以下指令取得硬連結，可看到下方有使用到這個
```bash
$ D:\test-nx\node_modules\.pnpm\express@4.18.2\node_modules\express>fsutil hardlink list index.js
\test-nx\node_modules\.pnpm\express@4.18.2\node_modules\express\index.js
\.pnpm-store\v3\files\76\6d2e202dd5e520ac227e28e3c359cca183605c52b4e4c95c69825c929356cea772723a9af491a3662d3c26f7209e89cc3a7af76f75165c104492dc6728acc
```

::: info
可以看到上方取得硬連結獲得兩個連結，一個是 store 中的檔案只要有專案安裝到相同版本的套件都會使用到這個硬連結
:::

* 以下示範第一次安裝 express 的結果與安裝過的結果

第一次
```bash
$ pnpm install
Lockfile is up to date, resolution step is skipped
Packages: +62
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: D:\.pnpm-store\v3
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 62, reused 0, downloaded 62, added 62, done

dependency:
+ express 4.18.2

Done in 1.6s
```

刪除 node_modules後 進行第二次安裝
```
$ rm -rf node_modules
$ pnpm install
Lockfile is up to date, resolution step is skipped
Packages: +62
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: D:\.pnpm-store\v3
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 62, reused 62, downloaded 0, added 62, done

dependency:
+ express 4.18.2

Done in 816ms
```

最大的區別就是從原本的 downloaded 變成 reused，時間也明顯減少許多，當有大量的 dependency 時，可以更加明顯感受到差異


* 以下參考滿推薦看 pnpm 軟連結與硬連結的區別文章，可以幫助釐清 pnpm 的運作方式

## 參考
* [pnpm 官網](https://pnpm.io/zh-TW/)
* [浅谈 pnpm 软链接和硬链接](https://zhuanlan.zhihu.com/p/442133074)

