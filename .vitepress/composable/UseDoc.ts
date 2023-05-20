import { ref } from 'vue';

export interface IArticle {
  title: string
  path: string
  desc: string
  date?: string
  tags?: string[]
  category?: string
}

export function useDoc() {
  const articles = import.meta.glob('../../docs/articles/*.md', { eager : true})
  
  const list = ref<IArticle[]>([])
  for(const file in articles) {
    const info = articles[file].__pageData

    const tagsString = info.frontmatter.tags
    let tags = []
    if(tagsString) {
      tags = tagsString.split(',')
    }

    list.value.push({
      title: info.title,
      path: info.relativePath,
      desc: info.description,
      tags,
      date: info.lastUpdated,
      category: info.frontmatter.category
    })
  }

  return {
    list
  }
}