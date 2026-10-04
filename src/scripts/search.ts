import { searchPoems, type Poem } from '../lib/api'
import { bindLangSelect, getLang } from '../lib/lang'

let searchSeq = 0

function renderResults(results: HTMLElement, poems: Poem[]) {
  results.replaceChildren()
  poems.forEach((poem, i) => {
    const li = document.createElement('li')
    li.style.setProperty('--i', String(i))

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'result-item'

    const title = document.createElement('span')
    title.className = 'result-title'
    title.textContent = poem.title || '无题'

    const meta = document.createElement('span')
    meta.className = 'result-meta'
    const dynasty = poem.dynasty?.name ?? ''
    const author = poem.author?.name ?? '佚名'
    meta.textContent = dynasty ? `${dynasty} · ${author}` : author

    const excerpt = document.createElement('span')
    excerpt.className = 'result-excerpt'
    const firstLine = Array.isArray(poem.content) ? poem.content[0] : ''
    excerpt.textContent = firstLine || ''

    btn.append(title, meta, excerpt)
    btn.addEventListener('click', () => {
      location.href = poem.id != null ? `/poem/?id=${poem.id}` : '/'
    })
    li.appendChild(btn)
    results.appendChild(li)
  })

  // 重置类名以重放结果条目的逐条入场动效
  results.classList.remove('fade-in')
  void results.offsetWidth
  results.classList.add('fade-in')
}

document.addEventListener('astro:page-load', () => {
  const form = document.getElementById('search-form') as HTMLFormElement | null
  const q = document.getElementById('search-q') as HTMLInputElement | null
  const searchStatus = document.getElementById('search-status')
  const results = document.getElementById('search-results')
  if (!form || !q || !searchStatus || !results) return

  async function runSearch(query: string) {
    const seq = ++searchSeq
    searchStatus.textContent = '搜索中…'
    results.replaceChildren()
    try {
      const { poems } = await searchPoems(query, getLang())
      if (seq !== searchSeq) return
      if (!poems.length) {
        searchStatus.textContent = '未找到相关诗词'
        return
      }
      searchStatus.textContent = `找到 ${poems.length} 首`
      renderResults(results, poems)
    } catch (err) {
      if (seq !== searchSeq) return
      searchStatus.textContent = err instanceof Error ? err.message : '搜索失败'
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = q.value.trim()
    if (query) void runSearch(query)
  })

  bindLangSelect(() => {
    const query = q.value.trim()
    if (query) void runSearch(query)
  })
})
