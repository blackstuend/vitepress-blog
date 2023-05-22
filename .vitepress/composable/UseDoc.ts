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
    return dayjs(b.date).valueOf() - dayjs(b.date).valueOf()
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