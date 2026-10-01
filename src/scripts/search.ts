import { searchPoems, type Poem } from '../lib/api'
import { bindLangSelect, getLang } from '../lib/lang'

const els = {
  form: document.getElementById('search-form') as HTMLFormElement,
  q: document.getElementById('search-q') as HTMLInputElement,
  searchStatus: document.getElementById('search-status')!,
  results: document.getElementById('search-results')!,
}

let searchSeq = 0

function renderResults(poems: Poem[]) {
  els.results.replaceChildren()
  for (const poem of poems) {
    const li = document.createElement('li')
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
    els.results.appendChild(li)
  }
}

async function runSearch(q: string) {
  const seq = ++searchSeq
  els.searchStatus.textContent = '搜索中…'
  els.results.replaceChildren()
  try {
    const { poems } = await searchPoems(q, getLang())
    if (seq !== searchSeq) return
    if (!poems.length) {
      els.searchStatus.textContent = '未找到相关诗词'
      return
    }
    els.searchStatus.textContent = `找到 ${poems.length} 首`
    renderResults(poems)
  } catch (err) {
    if (seq !== searchSeq) return
    els.searchStatus.textContent = err instanceof Error ? err.message : '搜索失败'
  }
}

els.form.addEventListener('submit', (e) => {
  e.preventDefault()
  const q = els.q.value.trim()
  if (!q) return
  void runSearch(q)
})

bindLangSelect(() => {
  const q = els.q.value.trim()
  if (q) void runSearch(q)
})
