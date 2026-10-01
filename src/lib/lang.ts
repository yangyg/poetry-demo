import type { Lang } from './api'

const LANG_KEY = 'poetry-lang'

export function getLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'zh-Hans' || v === 'zh-Hant') return v
  } catch {
    /* 隐私模式下 storage 不可用，忽略 */
  }
  return 'zh-Hans'
}

function saveLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* ignore */
  }
}

/** 初始化页面顶栏的语言下拉框，切换时持久化并回调 */
export function bindLangSelect(onChange: (lang: Lang) => void) {
  const sel = document.getElementById('lang') as HTMLSelectElement | null
  if (!sel) return
  sel.value = getLang()
  document.documentElement.lang = sel.value
  sel.addEventListener('change', () => {
    const lang = sel.value as Lang
    saveLang(lang)
    document.documentElement.lang = lang
    onChange(lang)
  })
}
