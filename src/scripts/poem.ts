import { fetchPoemById } from '../lib/api'
import { bindLangSelect, getLang } from '../lib/lang'
import {
  bindLayoutSwitch,
  renderPoemView,
  replayReveal,
  showPoemStatus,
  type PoemView,
} from '../lib/poem-view'

document.addEventListener('astro:page-load', () => {
  const view: PoemView = {
    status: document.getElementById('poem-status'),
    title: document.getElementById('poem-title'),
    meta: document.getElementById('poem-meta'),
    body: document.getElementById('poem-body'),
    stage: document.querySelector('.stage'),
  }
  if (!view.status || !view.title || !view.meta || !view.body) return
  const stage = view.stage
  if (stage) bindLayoutSwitch(stage, () => replayReveal(stage))

  const id = Number(new URLSearchParams(location.search).get('id'))

  async function loadPoem() {
    if (!Number.isInteger(id) || id <= 0) {
      showPoemStatus(view, '缺少诗歌 id，请从搜索结果进入')
      return
    }
    showPoemStatus(view, '正在取诗…')
    try {
      const poem = await fetchPoemById(id, getLang())
      renderPoemView(view, poem)
      document.title = `${poem.title || '无题'} — 诗泉`
    } catch (err) {
      showPoemStatus(view, err instanceof Error ? err.message : '加载失败，请稍后重试')
    }
  }

  bindLangSelect(() => {
    void loadPoem()
  })

  void loadPoem()
})
