import { fetchRandom, searchPoems } from './api.js'

const els = {
  lang: document.getElementById('lang'),
  readerStatus: document.getElementById('reader-status'),
  title: document.getElementById('poem-title'),
  meta: document.getElementById('poem-meta'),
  body: document.getElementById('poem-body'),
  btnRandom: document.getElementById('btn-random'),
  form: document.getElementById('search-form'),
  q: document.getElementById('search-q'),
  searchStatus: document.getElementById('search-status'),
  results: document.getElementById('search-results'),
}

/** @type {{ id?: number, title?: string, content?: string[], author?: { name: string }, dynasty?: { name: string }, type?: { name: string } } | null} */
let currentPoem = null
let searchSeq = 0

function lang() {
  return els.lang.value
}

function setReaderLoading(message = '正在取诗…') {
  els.readerStatus.hidden = false
  els.readerStatus.textContent = message
  els.title.hidden = true
  els.meta.hidden = true
  els.body.hidden = true
}

function renderPoem(poem) {
  currentPoem = poem
  els.readerStatus.hidden = true
  els.title.hidden = false
  els.meta.hidden = false
  els.body.hidden = false

  els.title.textContent = poem.title || '无题'
  const dynasty = poem.dynasty?.name ?? ''
  const author = poem.author?.name ?? '佚名'
  els.meta.textContent = dynasty ? `${dynasty} · ${author}` : author

  els.body.replaceChildren()
  const lines = Array.isArray(poem.content) ? poem.content : []
  for (const line of lines) {
    const p = document.createElement('p')
    p.textContent = line
    els.body.appendChild(p)
  }

  els.body.classList.remove('fade-in')
  void els.body.offsetWidth
  els.body.classList.add('fade-in')
  els.title.classList.remove('fade-in')
  void els.title.offsetWidth
  els.title.classList.add('fade-in')
}

function showReaderError(message) {
  els.readerStatus.hidden = false
  els.readerStatus.textContent = message
  els.title.hidden = true
  els.meta.hidden = true
  els.body.hidden = true
}

async function loadRandom() {
  els.btnRandom.disabled = true
  setReaderLoading()
  try {
    const poem = await fetchRandom(lang())
    renderPoem(poem)
  } catch (err) {
    showReaderError(err instanceof Error ? err.message : '加载失败，请稍后重试')
  } finally {
    els.btnRandom.disabled = false
  }
}

function renderResults(poems) {
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
      renderPoem(poem)
      document.querySelector('.reader')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    li.appendChild(btn)
    els.results.appendChild(li)
  }
}

async function runSearch(q) {
  const seq = ++searchSeq
  els.searchStatus.textContent = '搜索中…'
  els.results.replaceChildren()
  try {
    const { poems } = await searchPoems(q, lang())
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

els.btnRandom.addEventListener('click', () => {
  void loadRandom()
})

els.form.addEventListener('submit', (e) => {
  e.preventDefault()
  const q = els.q.value.trim()
  if (!q) return
  void runSearch(q)
})

els.lang.addEventListener('change', () => {
  document.documentElement.lang = lang()
  void loadRandom()
  const q = els.q.value.trim()
  if (q) void runSearch(q)
})

void loadRandom()
