/**
 * 首页 Tab 逻辑 — 随机刷诗
 * 搜索功能已拆分至 pages/search/search
 */
const app = getApp()
const { fetchRandom } = require('../../utils/api')

Page({
  data: {
    lang: 'zh-Hans',

    // ── 阅读区状态 ──
    readerLoading: true,
    readerError: '',
    randomLoading: false,
    poem: null,
    poemMeta: '',
    animKey: 0 // 递增 key 触发切换动画（对应 Web 端 fade-in class 重挂）
  },

  onLoad() {
    this.setData({ lang: app.getLang() })
    this.loadRandom()
  },

  /**
   * Tab 页每次显示时：
   * 1. 同步自定义 tabBar 选中态
   * 2. 消费搜索页传递的选中诗歌
   * 3. 语言在其他 Tab 被切换时重新加载
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }

    const currentLang = app.getLang()
    const langChanged = currentLang !== this.data.lang
    if (langChanged) {
      this.setData({ lang: currentLang })
    }

    // 搜索页选中的诗歌优先展示（已是对应语言的结果）
    const selected = app.globalData.selectedPoem
    if (selected) {
      app.globalData.selectedPoem = null
      this.renderPoem(selected)
    } else if (langChanged) {
      this.loadRandom()
    }
  },

  /* ══════════ 阅读区 ══════════ */

  /** 格式化诗歌元信息：朝代 · 作者 */
  formatMeta(poem) {
    const dynasty = (poem.dynasty && poem.dynasty.name) || ''
    const author = (poem.author && poem.author.name) || '佚名'
    return dynasty ? `${dynasty} · ${author}` : author
  },

  /** 渲染诗歌到阅读区（对应 Web 端 renderPoem） */
  renderPoem(poem) {
    this.setData({
      readerLoading: false,
      readerError: '',
      poem,
      poemMeta: this.formatMeta(poem),
      animKey: this.data.animKey + 1
    })
  },

  /** 加载随机诗（对应 Web 端 loadRandom） */
  async loadRandom() {
    this.setData({
      randomLoading: true,
      readerLoading: true,
      readerError: ''
    })
    try {
      const poem = await fetchRandom(app.getLang())
      this.renderPoem(poem)
    } catch (err) {
      this.setData({
        readerLoading: false,
        readerError: err.message || '加载失败，请稍后重试'
      })
    } finally {
      this.setData({ randomLoading: false })
    }
  },

  /** 「换一首」按钮 */
  onRandom() {
    if (this.data.randomLoading) return
    this.loadRandom()
  },

  /* ══════════ 简繁切换 ══════════ */

  /** 语言切换后重新加载随机诗 */
  onLangChange(e) {
    const { lang } = e.detail
    this.setData({ lang })
    this.loadRandom()
  }
})
