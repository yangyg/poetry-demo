/**
 * 首页逻辑 — 迁移自 Web 端 src/main.js
 * 功能：随机刷诗、关键词搜索、简繁切换
 */
const app = getApp()
const { fetchRandom, searchPoems } = require('../../utils/api')

Page({
  data: {
    lang: 'zh-Hans',

    // ── 阅读区状态 ──
    readerLoading: true,
    readerError: '',
    randomLoading: false,
    poem: null,
    poemMeta: '',
    animKey: 0, // 递增 key 触发切换动画（对应 Web 端 fade-in class 重挂）

    // ── 搜索区状态 ──
    query: '',
    searchLoading: false,
    searchStatus: '',
    results: []
  },

  /** 搜索竞态序号（对应 Web 端 searchSeq） */
  _searchSeq: 0,

  onLoad() {
    this.setData({ lang: app.getLang() })
    this.loadRandom()
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

  /* ══════════ 搜索区 ══════════ */

  onInput(e) {
    this.setData({ query: e.detail.value })
  },

  /** 执行搜索（对应 Web 端 runSearch） */
  async runSearch(q) {
    const seq = ++this._searchSeq
    this.setData({
      searchLoading: true,
      searchStatus: '搜索中…',
      results: []
    })
    try {
      const { poems } = await searchPoems(q, app.getLang())
      if (seq !== this._searchSeq) return // 竞态保护
      if (!poems.length) {
        this.setData({ searchLoading: false, searchStatus: '未找到相关诗词' })
        return
      }
      // 预处理列表展示字段
      const results = poems.map((poem) => ({
        ...poem,
        metaText: this.formatMeta(poem),
        excerpt: Array.isArray(poem.content) ? poem.content[0] || '' : ''
      }))
      this.setData({
        searchLoading: false,
        searchStatus: `找到 ${poems.length} 首`,
        results
      })
    } catch (err) {
      if (seq !== this._searchSeq) return
      this.setData({
        searchLoading: false,
        searchStatus: err.message || '搜索失败'
      })
    }
  },

  /** 搜索按钮 / 键盘确认 */
  onSearch() {
    const q = this.data.query.trim()
    if (!q || this.data.searchLoading) return
    this.runSearch(q)
  },

  /**
   * 点击搜索结果 → 阅读区展示该诗并滚动到顶部
   * （对应 Web 端 renderPoem + scrollIntoView）
   */
  onResultTap(e) {
    const { index } = e.currentTarget.dataset
    const poem = this.data.results[index]
    if (!poem) return
    this.renderPoem(poem)
    wx.pageScrollTo({ scrollTop: 0, duration: 300 })
  },

  /* ══════════ 简繁切换 ══════════ */

  /**
   * 语言切换后重新请求当前视图
   * （对应 Web 端 lang change 事件：重载随机诗 + 重跑搜索）
   */
  onLangChange(e) {
    const { lang } = e.detail
    this.setData({ lang })
    this.loadRandom()
    const q = this.data.query.trim()
    if (q) this.runSearch(q)
  }
})
