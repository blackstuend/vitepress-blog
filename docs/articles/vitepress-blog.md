---
title: vitepress 建立客製化部落格
description: vitepress 本身就是一個很好的文檔系統，但要建立自己的部落格通常還是透過 hexo 或是其他已經很成熟的 template 都是更為適合的選項，但也可以透過稍作修改將 vitepress 的 UI 設計成類似於部落格的形式，就可以使用到 vitepress 的那些優點，包含可使用 vue 的方式進行引入，以及自動化的路由對應都是非常方便的
tags: vue,vite
---

# Vitepress 建立客製化 Blog
vitepress 本身就是一個很好的文檔系統，但要建立自己的部落格通常還是透過 hexo 或是其他已經很成熟的 template 都是更為適合的選項，但也可以透過稍作修改將 vitepress 的 UI 設計成類似於部落格的形式，就可以使用到 vitepress 的那些優點，包含可使用 vue 的方式進行引入，以及自動化的路由對應都是非常方便的，[github](https://github.com/blackstuend/vitepress-blog)  

:::tip
在建立成 blog 前建立先將 [vitepress 官方文件](https://vitepress.dev/)讀過，在閱讀會比較好理解，以防有些細節講解不清
:::

## 建立 vitepress
```bash
$ npm install -D vitepress
$ npx vitepress init
```

* 如有使用到 sass 或是 less，都可直接安裝，就可以做使用

```bash
$ npm install sass less -D
```

## 安裝元件庫
參考了一下 vue3 最多人用的元件庫還是以 vuetify 為最多人使用的，如習慣 element-plus 也是可以安裝，則一安裝即可，以下會以 vuetify 安裝為主


```bash
$ npm install -D vuetify 
```

* 如需使用到圖標(icon)需額外安裝指定的圖標素材
```
$ npm install @mdi/font -D
```

* 註冊元件庫
需特別注意需要再額外設置 ssr ，由於 vite 是直接引用 esm 模組，vuetify 還不知支援完整的 ESM 模組

```ts
// .vitepress/config.ts
import vuetify from 'vite-plugin-vuetify'
export default defineConfig({
    ...,
    vite: {
    // https://vitejs.dev/config/
        plugins: [
        vuetify(),
        ],
        ssr: {
        // TODO: workaround until they support native ESM
        noExternal: ['vuetify'],
        },
  },
})
```

```ts
// .vitepress/theme/index.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' 

export default {
  ...
  enhanceApp({ app, router, siteData }) {
    const vuetify = createVuetify({
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    });

    app.use(vuetify)
  }
}
```

## 建立主頁
* 建立 index.md，並將 home 的元件引入

```md
---
layout: home
---

<script lang="ts" setup>
import Home from '../.vitepress/components/Home.vue'
</script> 


<Home></Home>

```

接著在 home 這個 component 製作自己的 UI 即可

## 取得各資料夾的狀況
透過 vite 提供的 API(import.meta.glob) 即可取得相對應的資訊

```ts
const articles = import.meta.glob('../../docs/articles/*.md', { eager : true})
```

可以將取得資料寫成 composable 以利其他地方做使用

```ts
// UseDoc.ts
import { ref } from 'vue';
import dayjs from 'dayjs';

export interface IArticle {
  title: string
  path: string
  desc: string
  date?: string
  tags?: string[]
  category: string
}

export function useDoc() {
  const articles = import.meta.glob('../../docs/articles/*.md', { eager : true})
  
  const list = ref<IArticle[]>([])

  const rawList:IArticle[] = [];
  for(const file in articles) {
    const info = articles[file].__pageData

    const tagsString = info.frontmatter.tags
    let tags = []
    if(tagsString) {
      tags = tagsString.split(',')
    }

    rawList.push({
      title: info.title,
      path: info.relativePath.replace('.md', ''),
      desc: info.description,
      tags,
      date: dayjs(info.lastUpdated).format('YYYY/MM/DD HH:mm:ss'),
      category: info.frontmatter.category
    })
  }

  rawList.sort((a,b)=>{
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  })

  list.value = rawList

  // get unique tags
  const tags = ref<Set<string>>(new Set<string>())
  list.value.forEach(item => {
    item.tags?.forEach(tag => {
      tags.value.add(tag)
    })
  })

  // get unique category
  const categories = ref<Set<string>>(new Set<string>())
  list.value.forEach(item => {
    categories.value.add(item.category)
  })



  return {
    list,
    tags,
    categories,
  }
}
```

## 結論
這也不是第一次做 blog ，還記得第一次做 blog，還是用 express 搭配 bootstrap 再去買虛擬主機進行架設，在配置 database, let's encrypt SSL, nginx 相當繁雜但也很有趣，可以學到很多知識，後來知道有 hexo nuxt... 等等 ssg 來生成靜態網站來進行部屬都是相當方便，這一次 vitepress 雖然也是遇到不少坑，但相比之前遇到地確實是少得非常多了，而且 vitepress 本身的 UI/UX 就做得很漂亮了，花的成本遠比之前少很多，算是非常好的一個工具