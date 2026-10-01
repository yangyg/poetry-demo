import type { Poem } from './api'

/** 首页阅读区与详情页共用的诗歌渲染结构 */
export interface PoemView {
  status: HTMLElement
  title: HTMLElement
  meta: HTMLElement
  body: HTMLElement
}

export function showPoemStatus(view: PoemView, message: string) {
  view.status.hidden = false
  view.status.textContent = message
  view.title.hidden = true
  view.meta.hidden = true
  view.body.hidden = true
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
  for (const line of lines) {
    const p = document.createElement('p')
    p.textContent = line
    view.body.appendChild(p)
  }

  replayFade(view.body)
  replayFade(view.title)
}

function replayFade(el: HTMLElement) {
  el.classList.remove('fade-in')
  void el.offsetWidth
  el.classList.add('fade-in')
}
