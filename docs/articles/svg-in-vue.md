---
title: SVG 在 Vue 中的使用幾種方式
description: 在做專案時，常使用到圖標，以往都是使用img的方式引入，但當我第一次接觸到製作 web app 時，圖標就會大量被使用到，且根據使用的情境，圖標的顏色與大家都會做更改，於是上網找了幾種在做專案時不同使用 svg 圖標的方式
tags: vue
---

# Svg 在 Vue 中的使用幾種方式
在做專案時，常使用到圖標，以往都是使用img的方式引入，但當我第一次接觸到製作 web app 時，圖標就會大量被使用到，且根據使用的情境，圖標的顏色與大家都會做更改，於是上網找了幾種在做專案時不同使用 svg 圖標的方式


## 第一種: 使用 img 標籤直接引入
1. 優點:
    * 這一種方式也是最常使用且最易使用的
    * 修改寬高也很方便
2. 缺點:
    * 更換顏色不易，可使用 filter css 來做更換，但對於舊的瀏覽器支援度並不高
    * 在 Vue 中的 webpack 做使用由於是使用 file-loader，每一次使用都需要做額外的請求


### 更換顏色方法
* 使用 css filter 來做更動，使用 color code 轉換 filter，可使用此網站來做轉換:[網站](https://codepen.io/sosuke/pen/Pjoqqp)

```html
<img src="user.svg" class="icon-user" />
<style>
.icon-user {
filter: invert(56%) sepia(22%) saturate(7160%) hue-rotate(159deg) brightness    (92%) contrast(101%);
}
</style>
```

## 第二種: 直接將 svg 嵌入
1. 優點:
    * 使用簡易直接複製貼上
    * 可藉由 css 更動 svg 內部的參數來做動畫
2. 缺點:
    * 當 svg 內部是過於複雜的圖案，可讀性會變得很差

```html
<svg width="16" class="icon-user" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 5C11.5 6.933 9.933 8.5 8 8.5C6.067 8.5 4.5 6.933 4.5 5C4.5 3.067 6.067 1.5 8 1.5C9.933 1.5 11.5 3.067 11.5 5ZM10.5 5C10.5 3.61929 9.38071 2.5 8 2.5C6.61929 2.5 5.5 3.61929 5.5 5C5.5 6.38071 6.61929 7.5 8 7.5C9.38071 7.5 10.5 6.38071 10.5 5Z" fill="black" fill-opacity="0.9"/>
    <path d="M13.9631 10.8528C14.297 11.0122 14.5 11.3547 14.5 11.7246V14C14.5 14.2761 14.2761 14.5 14 14.5H2C1.72386 14.5 1.5 14.2761 1.5 14V11.7246C1.5 11.3547 1.70302 11.0122 2.03686 10.8528C3.8494 9.98708 5.86651 9.5 8 9.5C10.1335 9.5 12.1506 9.98708 13.9631 10.8528ZM8 10.5C6.0334 10.5 4.17435 10.9457 2.5 11.7398V13.5H13.5V11.7398C11.8257 10.9457 9.9666 10.5 8 10.5Z" fill="black" fill-opacity="0.9"/>
</svg>

<style lang="scss">
.icon-user {
  width: 300px;
  height: 300px;
  path {
      fill: red;
  }
}
</style>
```

## 第三種: 使用 SVG Sprites Loader
* Svg Sprite 是藉由 svg 中 `use` 的使用，可藉由之前引入過的 svg，來做不斷地復用，而在 Vue 專案中需要搭配 webpack loader 的設定來達成。
* 優點:
    1. 更換顏色與大小便利
* 缺點:
    1. 設定較為繁複

### 安裝
```bash
$ npm install --save --dev svg-sprite-loader 
```

### 設定 webpack
以下是 Vue2, vue.config.js 的設定

```js
module.exports = {
  chainWebpack: config => {

    // 先刪除預設的svg配置
    config.module.rules.delete("svg")

    // 新增 svg-sprite-loader 設定
    config.module
      .rule("svg-sprite-loader") 
      .test(/\.svg$/)
      .include
      .add(resolve("src/assets/icon")）
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "[name]" })

    // 修改 images-loader 配置
    config.module
      .rule("images")
      .exclude.add(resolve("src/assets/icon"))
  }
}
```

### 在 Vue 中做使用
```html
<template>
    <div>
        <svg class="icon-user"><use xlink:href="#user" /></svg>
    </div>
</template>

<script>
import "@/src/assets/icons/user.svg";
</script>
<style>
    .icon-user {
        color: red;
        width: 20px;
        height: 20px;
    }
</style>
```

### 全域引入
在 Vue 啟動專案時就將 所有圖標一次引入，就不用在各個 Vue 檔個別去引入單個 svg

```js
// src/main.js
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context("@/src/assets/icons", true, /\.svg$/)
requireAll(req)
```

### 封裝 Svg Component

```html
// src/components/SvgIcon.vue
<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor !important;
  overflow: hidden;
}
</style>
```

### 註冊 SvgIcon 到 Vue
```js
// src/main.js
import SvgIcon from './src/components/SvgIcon.vue'

Vue.component('SvgIcon',SvgIcon)
```

### 使用 Svg Component
```html
// src/App.vue

<template>
  <div id="app">
    <h1>Icon</h1>
    <SvgIcon name="user" class="icon-user"></SvgIcon>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.icon-user {
  width: 50px;
  height: 50px;
  color: red;
}
</style>
```

## 第四種: 使用 IconFont
常見於 font-awesome 或是 material icon ，都是一開始學習使用 icon 常見的方式
* 優點:
    1. 減少圖片的 http 請求
    2. 上手容易
    3. 更動顏色與大小容易
* 缺點:
    1. 由於是字體所以只能是單色的
    2. 新增新的圖標都需要重新 build
    3. 由於 Icon font 是使用偽元素來控制樣式，可能會受到其他 class 影響
    4. 銳利度不如 svg，由於字體的 font-smoothing 基本上會設定為 auto 或 antialiased

### 使用 GUI 介面製作自己的 font icon
* 常用的 fontIcon 製作網站 [icomoon](https://icomoon.io/app/#/select)

### 使用 script 製作自己的 font icon

#### 安裝
```bash
$ npm install fantasticon --save --dev
```

#### 使用
先設定 package.json script
```json
// package.json
"scripts": {
    "gen-iconFont": "fantasticon ./src/assets/icons -o iconDist --normalize true"
},
```

啟動腳本 
```bash
$ mkdir iconDist
$ npm run gen-iconFont
```

修改 css文件，由於這個套件一直有一個 [bug](https://github.com/tancredi/fantasticon/issues/11)，必須把 i[class^="icon-"] 後墜的 ::before 刪除，才不會造成 svg 高度跑掉

```css
// iconDist/icons.css
i[class^="icon-"], i[class*=" icon-"] {
    font-family: icons !important;
    font-style: normal;
    font-weight: normal !important;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-user:before {
    content: "\f101";
}
```

引入 css
```js
// src/main.js
import '../iconDist/icons.css'

```

使用
````html
// src/App.vue

<template>
  <div id="app">
    <h1>Icon</h1>
   <div>
     <i class="icon-user"></i>
   </div>
  </div>
</template>
<style>
    .icon-user {
        font-size: 16px;
        color: red;
    }
</style>
````

## 第六種: 使用 [Iconify](https://iconify.design/)
* Iconify 是一個開源的 npm 套件，它裡面收集各大圖標平台上面的圖標，然後整合在一起

###  安裝
```bash
$ npm install --save-dev @iconify/vue2
```

### 使用
```html
<template>
    <div>
        <Icon icon="mdi-light:home" />
    </div>
</template>
<script>
    import { Icon } from '@iconify/vue2';
    export default {
        components: {
            Icon,
        },
    }
</script>
```


## 參考資料
1. https://ithelp.ithome.com.tw/articles/10212457
2. https://maxleebk.com/2020/05/18/vue-svg/
3. https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-styles-with-css
4. https://www.npmjs.com/package/fantasticon
5. https://cythilya.github.io/2013/10/08/icon-fonts-tutorial/