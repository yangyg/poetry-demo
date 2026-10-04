import { fetchRandom } from '../lib/api'
import { bindLangSelect, getLang } from '../lib/lang'
import {
  bindLayoutSwitch,
  renderPoemView,
  replayReveal,
  showPoemStatus,
  type PoemView,
} from '../lib/poem-view'

// ClientRouter 转场下模块仅执行一次，每次页面换入后重新查询并绑定
document.addEventListener('astro:page-load', () => {
  const view: PoemView = {
    status: document.getElementById('reader-status'),
    title: document.getElementById('poem-title'),
    meta: document.getElementById('poem-meta'),
    body: document.getElementById('poem-body'),
    stage: document.querySelector('.stage'),
  }
  if (!view.status || !view.title || !view.meta || !view.body) return
  const btnRandom = document.getElementById('btn-random') as HTMLButtonElement | null
  if (!btnRandom) return
  const stage = view.stage
  if (stage) bindLayoutSwitch(stage, () => replayReveal(stage))

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
})
