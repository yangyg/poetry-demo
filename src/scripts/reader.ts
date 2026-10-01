import { fetchRandom } from '../lib/api'
import { bindLangSelect, getLang } from '../lib/lang'
import { renderPoemView, showPoemStatus, type PoemView } from '../lib/poem-view'

const view: PoemView = {
  status: document.getElementById('reader-status')!,
  title: document.getElementById('poem-title')!,
  meta: document.getElementById('poem-meta')!,
  body: document.getElementById('poem-body')!,
}

const btnRandom = document.getElementById('btn-random') as HTMLButtonElement

async function loadRandom() {
  btnRandom.disabled = true
  showPoemStatus(view, '正在取诗…')
  try {
    renderPoemView(view, await fetchRandom(getLang()))
  } catch (err) {
    showPoemStatus(view, err instanceof Error ? err.message : '加载失败，请稍后重试')
  } finally {
    btnRandom.disabled = false
  }
}

btnRandom.addEventListener('click', () => {
  void loadRandom()
})

bindLangSelect(() => {
  void loadRandom()
})

void loadRandom()
