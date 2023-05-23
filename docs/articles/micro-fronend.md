---
title: 淺談微前端
description: 在公司越來越多前端專案，使用不同的技術例如 vue,react 又或是原生的 js，而像是 vue2 與 vue3 在元件上又不互相兼容，也導致了共通性有些落差，且每個同事間的掌握的能力也不盡相同，近期跟著 micro service 的風潮，micro frontend 討論度也慢慢起來，下面會說明我使用的心得
tags: web
---

# 淺談微前端
在公司越來越多前端專案，使用不同的技術例如 vue,react 又或是原生的 js，而像是 vue2 與 vue3 在元件上又不互相兼容，也導致了共通性有些落差，且每個同事間的掌握的能力也不盡相同，近期跟著 micro service 的風潮，micro frontend 討論度也慢慢起來，下面會說明我使用的心得

## 什麼是微前端
類似於為服務的架構，將原本一個大的架構拆分成各個小小的功能，在各別的打包與部屬，在微前端也是使用這種理念，希望可以在不同框架中引入其他莊稼的原件來進行使用，或是在一個大個網站上，引入不同的子應用網站在交互過程中看起來都會更加順暢，也大大了解耦了程式碼的複雜度，最早期大多採用 iframe 的作法，雖然易用但也延伸了幾點問題

## 為前端的價值
1. 無關技術與工具
2. 獨立部屬獨立開發
3. 狀態隔離

## 微前端常見的實作技術
1. JS Entry: 將子元件或是子應用打包成 entry script，讓主應用可以進行引入，但由於是在 s 進行引用時會友生命週期，且需要相對應的 API 來進行接取，也導致使用 JS entry 的微前端框架對於代碼的侵入性都非常高，需要對於原代碼進行改造

2. HTML Entry: 是由 [`import-html-entry`](https://github.com/kuitos/import-html-entry) 實現的，他會將 HTML 裡面的元素進行拆分，例如 script, styles, template 有點類似於 `vue` 裡面的三大元素，在使用 fetch 來進行加載裡面包含的 js css 等等


3. Shadow DOM: Shadow DOM 其實一直存在於我們的 HTML 結構，最常見就是 \<video /> \<input /> 標籤都是，在微前端主要用於隔離 css 形成一個沙盒來避免 css 汙染到子應用或是主應用

    * 以下是常見的 video 屬性，他的播放鍵進度調都是藏在 Shadow DOM 中，一般是無法查看需要開啟額外的設定

        進入 chrome setting
        ![chore setting position](/images/shadow-dom-setting-1.png)

        開啟 shadow dom 顯示
        ![shadow dom setting](/images/shadow-dom-setting-2.png)

        video 顯示出 shadow dom
        ![video shadow dom](/images/shadow-dom-setting-3.png)

4. Web Component: 實作後可類似於 前端框架(element-ui antd) 的那些元件庫的引用方式，可以使用客制化的元素名稱進行引入

## 常用的作法與工具
1. iframe
2. single-spa 與 qiankun(乾坤)
3. webpack module federation
4. wujie
5. micro-app

## iframe 
最早期的應用方式，使用 html 所提供的 iframe 元素就可以建立起來，再傳入想呈現的畫面，大部分得情況使用 iframe 其實就可以了，但也有一些場井部好使用，可參考 [Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)

* 優點
    1. 介面隔離，讓子應用與主應用完全區隔開來
    2. 設定簡單容易

* 缺點
    1. 寬度與高度不好設定，需要額外的 js 進行適配
    2. url 不同步，dom 結構不共享，假如有片面的 loading cover 區塊則無法完整覆蓋
    3. context 完全隔離，無法共享，共享參數只能藉由 postMessage 來實做

```html
<iframe src="http://www.fooish.com/">
  你的瀏覽器不支援 iframe
</iframe>
```

* 主頁傳輸給 iframe
```js
const iframe = document.getElementById('iframe').contentWindow;
iframe.postMessage('message', 'https://iframe.tw');
```

* iframe 頁面監聽事件
```js 
window.addEventListener('message', callback, false);
```

## single-spa 和 乾坤

* [single-spa](https://single-spa.js.org/) 作為最早期的微前端框架主要是使用上述的 JS Entry 方式進行引入，需要在程式碼中加入自己的生命周期，而他的理念是會有一個主應用底下有許多子應用，當路由變化時，則會渲染出不同的頁面，如以下的圖

![single spa root](/images/single-spa-root.png)


且是使用 JS Entry 的方式引入，以下是官方的程式，可以看到下面有對應的路徑和要載入哪一支 js 檔案

```js
import * as singleSpa from 'single-spa';
const name = 'app1';
/* loading 是一个返回 promise 的函数，用于 加载/解析 应用代码。
 * 它的目的是为延迟加载提供便利 —— single-spa 只有在需要时才会下载应用程序的代码。
 * 在这个示例中，在 webpack 中支持 import ()并返回 Promise，但是 single-spa 可以使用任何返回 Promise 的加载函数。
 */
const app = () => import('./app1/app1.js');
/* Single-spa 配置顶级路由，以确定哪个应用程序对于指定 url 是活动的。
 * 您可以以任何您喜欢的方式实现此路由。
 * 一种有用的约定是在url前面加上活动应用程序的名称，以使顶层路由保持简单。
 */
const activeWhen = '/app1';
singleSpa.registerApplication({ name, app, activeWhen });
singleSpa.start();
```

在子應用也必須掛載相對應的生命週期

```js
let domEl;
export function bootstrap(props) {
    return Promise
        .resolve()
        .then(() => {
            domEl = document.createElement('div');
            domEl.id = 'app1';
            document.body.appendChild(domEl);
        });
}
export function mount(props) {
    return Promise
        .resolve()
        .then(() => {
            // 在这里通常使用框架将ui组件挂载到dom。请参阅https://single-spa.js.org/docs/ecosystem.html。
            domEl.textContent = 'App 1 is mounted!'
        });
}
export function unmount(props) {
    return Promise
        .resolve()
        .then(() => {
            // 在这里通常是通知框架把ui组件从dom中卸载。参见https://single-spa.js.org/docs/ecosystem.html
            domEl.textContent = '';
        })
}
```

* [乾坤](https://qiankun.umijs.org/): 微阿里巴巴進行維護，將 single-spa 進行二進包裝，最大的區別是從 js entry 變成 html entry，讓他可以載入更完整的 template，撰寫上也較為簡易

* 使用乾坤與 single-spa 雖然可達到上述的價值，但缺點也顯而易見，需要對子應用做修改(新增生命週期)，對於一些舊專案的維護較為不容易，而且編譯上其實很多小問題，官方推薦的是 webpack 來編譯出對應的 umd 檔案，如果要用 vite 又需要額外的配置，相當繁雜，而且他是根據路由的變換來更改子應用的選擇，也導致子應用在一個頁面只能載入一個，如果是針對做元件的使用較為難使用

## Webpack federation
是 Webpack 5 提出的概念，用來解決各個子應用的代碼共享問題，他並不是一個框架，而只是一個工具，所以你想要什麼的週期是可以自己決定，傳輸方式也是自己控制，在裡面最重要的是他的分享概念，假如每個子應用都用到相對應的資源，那在載入時都會載到相同的資源而導致資源浪費，他可在父層設置好要共享的資源即可在子應用載入時去使用共同的資源


Host(主應用)

```js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        vue: { singleton: true, eager: true, requiredVersion: '^2.6.14' },
      },
    }),
  ],
};
```

Child(子應用)
```js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote',
      exposes: {
        './App': './src/App',
      },
      shared: {
        vue: { singleton: true, eager: true, requiredVersion: '^2.6.14' },
      },
    }),
  ],
};
```

* 在使用上我覺得有點像是引入 npm 套件的感覺，但是解決了共用資源的問題，而且在主應用打包時也是會一併將子應用一同打包進去，在使用上野不少坑，在主應用引用子應用一定得用非同步的方式引入，還有主應用引入子應用的名稱，不能跟 element 設定的 id 相同，諸多小問題，也導致我沒有研究的很深就覺得很煩，且一定得使用 webpack 5 才能使用

# 無界(wujie)
[無界](https://wujie-micro.github.io/doc/)由騰訊開發，作為後起之雄，吸收了前面那幾個問題進行改善，文檔相對齊全，對於 vite vue react 都有很高的支援度，使用 webComponent 搭配 iframe 進行封裝，解決 iframe 上述所討論到的缺點，但也利用 iframe 沙盒的優點來達成 js 的獨立執行，使用上非常易用

* 安裝
```bash
# vue2 框架
$ npm i wujie-vue2 -S
# vue3 框架
$ npm i wujie-vue3 -S
```

* 引用
```js
// vue2
import WujieVue from "wujie-vue2";
// vue3
import WujieVue from "wujie-vue3";

const { bus, setupApp, preloadApp, destroyApp } = WujieVue;

Vue.use(WujieVue);
```

* 使用
```vue
<WujieVue
  width="100%"
  height="100%"
  name="xxx"
  :url="xxx"
  :sync="true"
  :fetch="fetch"
  :props="props"
  :beforeLoad="beforeLoad"
  :beforeMount="beforeMount"
  :afterMount="afterMount"
  :beforeUnmount="beforeUnmount"
  :afterUnmount="afterUnmount"
></WujieVue>
```

* 使用方式相當簡單，上面只是簡單使用的方式，一般還有路由變化進行更換和通訊交換還是需要額外設定，加上他有強大的代碼隔離效果(iframe)，都相對安全許多，缺點大概就是他是使用 web-component 在某些舊瀏覽器可能無法使用(ie XD)，對 SEO 支援度也較差，但這也是目前我們公司採用的方式，對於一些簡易的元件來使用方便許多

## MicroApp
[MicroApp](https://zeroing.jd.com/micro-app/)由京東開發的微前端框架，使用 WebComponent 搭配 HTML entry 與 Shadow DOM 來進行渲染，他是繼 single-spa 與乾坤後推出的，也是記取乾坤的一些問題進行改良，設定也跟無界一樣簡單，不需要對於子應用進行修改，也有對於 vite 與 vue 都有詳盡的說明

* 安裝
```
$ npm i @micro-zoe/micro-app --save
```

* 引用
```js
// main.js
import microApp from '@micro-zoe/micro-app'

microApp.start()
```

* 路由調整
```js
// router.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import MyPage from './my-page.vue'

Vue.use(VueRouter)

const routes = [
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/my-page/*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'my-page',
    component: MyPage,
  },
]

export default routes
```

* 子應用路由調整
```js
// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

const router = new VueRouter({
  // 👇 设置基础路由，子应用可以通过window.__MICRO_APP_BASE_ROUTE__获取基座下发的baseroute，如果没有设置baseroute属性，则此值默认为空字串
  base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  routes,
})

let app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
```

* 配置 CORS
```js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
},
```

::: tip
如果上正式則可以使用 nginx 在 header 加上 CORS 設定
:::

* 他跟無界用起來配置都滿相似，也很簡單，主要是在子應用需要多設定路由，也由於他跟無界都是使用 web-component 進行時做他的 SEO 一樣不好


## 結論
在我用完上述幾款，目前認為無界以及 micro-app 體驗真的都是滿好的，一方便不用對舊 code 進行修改就很舒服。而我認為大部分的需求其實用 iframe 就可以做到 8成 了，除非有特別需要針對路由而進行變換(其實 iframe 也可以做到)，或是想要做到 UI/UX 有更好的體驗，的確是可以使用上述的工具來達到要的效果，但目前我有使用到的工具也只剩無界(笑

## 參考資料
* [微前端架构的几种技术选型](https://juejin.cn/post/7113503219904430111)
* [postMessage：主頁、iframe 頁可互相傳值](https://www.letswrite.tw/postmessage/)
* [qiankun](https://qiankun.umijs.org/zh/guide)
* [Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)
* [微前端的核心价值](https://zhuanlan.zhihu.com/p/95085796)