import { bindLangSelect } from '../lib/lang'

// 关于页为静态内容，仅需在每次页面换入后重新绑定语言偏好持久化
document.addEventListener('astro:page-load', () => {
  bindLangSelect(() => {})
})
