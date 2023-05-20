import { defineConfig } from 'vitepress'
import vuetify from 'vite-plugin-vuetify'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './docs',
  title: "Lucian's blog",
  description: "Record my life in this, and share my programming experience.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  vite: {
    // https://vitejs.dev/config/
    plugins: [
      vuetify(),
    ]
  },
})
