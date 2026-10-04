import type { Poem } from './api'

/** 首页阅读区与详情页共用的诗歌渲染结构 */
export interface PoemView {
  status: HTMLElement
  title: HTMLElement
  meta: HTMLElement
  body: HTMLElement
  /** 承载逐行/钤印动效的舞台容器，缺省时退化为无动效渲染 */
  stage?: HTMLElement | null
}

/* ---------- 版式偏好：竖排（手卷） / 横排（现代） ---------- */

export type PoemLayout = 'vertical' | 'horizontal'

const LAYOUT_KEY = 'poetry-layout'

export function getPoemLayout(): PoemLayout {
  try {
    const v = localStorage.getItem(LAYOUT_KEY)
    if (v === 'vertical' || v === 'horizontal') return v
  } catch {
    /* 隐私模式下 storage 不可用，忽略 */
  }
  return 'horizontal'
}

export function savePoemLayout(mode: PoemLayout) {
  try {
    localStorage.setItem(LAYOUT_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function applyLayout(stage: HTMLElement) {
  const mode = getPoemLayout()
  stage.dataset.layout = mode
  stage.querySelectorAll('.layout-btn').forEach((btn) => {
    const el = btn as HTMLButtonElement
    const active = el.dataset.mode === mode
    el.classList.toggle('active', active)
    if (active) el.setAttribute('aria-pressed', 'true')
    else el.removeAttribute('aria-pressed')
  })
}

/** 绑定版式切换：持久化偏好、即时生效并重放落墨动效 */
export function bindLayoutSwitch(stage: HTMLElement, replay: () => void) {
  applyLayout(stage)
  stage.querySelectorAll('.layout-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = (btn as HTMLElement).dataset.mode
      if (mode !== 'vertical' && mode !== 'horizontal') return
      savePoemLayout(mode)
      applyLayout(stage)
      replay()
    })
  })
}

/* ---------- 渲染 ---------- */

export function showPoemStatus(view: PoemView, message: string) {
  if (view.stage) view.stage.classList.remove('reveal')
  view.status.hidden = false
  view.status.textContent = message
  view.title.hidden = true
  view.meta.hidden = true
  view.body.hidden = true
}

export function replayReveal(stage: HTMLElement) {
  stage.classList.remove('reveal')
  void stage.offsetWidth
  stage.classList.add('reveal')
}

export function renderPoemView(view: PoemView, poem: Poem) {
  view.status.hidden = true
  view.title.hidden = false
  view.meta.hidden = false
  view.body.hidden = false

  view.title.textContent = poem.title || '无题'
  const dynasty = poem.dynasty?.name ?? ''
  const author = poem.author?.name ?? '佚名'
  const type = poem.type?.name ?? ''
  view.meta.textContent = [dynasty, author, type].filter(Boolean).join(' · ')

  view.body.replaceChildren()
  const lines = Array.isArray(poem.content) ? poem.content : []
  lines.forEach((line, i) => {
    const span = document.createElement('span')
    span.className = 'poem-line'
    span.style.setProperty('--i', String(i))
    span.textContent = line
    view.body.appendChild(span)
  })

  if (lines.length) {
    const seal = document.createElement('span')
    seal.className = 'poem-seal'
    seal.textContent = (poem.author?.name ?? '诗')[0]
    seal.style.setProperty('--i', String(lines.length))
    view.body.appendChild(seal)
  }
  view.body.style.setProperty('--lines', String(lines.length))

  if (view.stage) replayReveal(view.stage)
}
