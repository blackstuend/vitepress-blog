import { defineConfig } from 'vitepress'
import vuetify from 'vite-plugin-vuetify'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './docs',
  title: "Lucian's blog",
  description: "Record my life in this, and share my programming experience.",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tags', link: '/tags' },
      { text: 'About', link: '/about' }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/blackstuend' }
    ]
  },
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
