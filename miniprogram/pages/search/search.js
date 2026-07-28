/**
 * 搜索 Tab 逻辑 — 寻诗
 * 迁移自原 pages/index 的搜索区，保留竞态保护机制
 * 点击结果 → 存入全局 selectedPoem → switchTab 到首页展示
 */
const app = getApp()
const { searchPoems } = require('../../utils/api')

Page({
  data: {
    lang: 'zh-Hans',
    query: '',
    searchLoading: false,
    searchStatus: '',
    results: []
  },

  /** 搜索竞态序号（对应 Web 端 searchSeq） */
  _searchSeq: 0,

  onLoad() {
    this.setData({ lang: app.getLang() })
  },

  /**
   * Tab 页每次显示时：
   * 1. 同步自定义 tabBar 选中态
   * 2. 语言在其他 Tab 被切换时，重跑当前搜索
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }

    const currentLang = app.getLang()
    if (currentLang !== this.data.lang) {
      this.setData({ lang: currentLang })
      const q = this.data.query.trim()
      if (q) this.runSearch(q)
    }
  },

  /* ══════════ 搜索区 ══════════ */

  /** 格式化诗歌元信息：朝代 · 作者 */
  formatMeta(poem) {
    const dynasty = (poem.dynasty && poem.dynasty.name) || ''
    const author = (poem.author && poem.author.name) || '佚名'
    return dynasty ? `${dynasty} · ${author}` : author
  },

  onInput(e) {
    this.setData({ query: e.detail.value })
  },

  /** 执行搜索（对应 Web 端 runSearch，含竞态保护） */
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
   * 点击搜索结果 → 存入全局并切换到首页 Tab 展示
   * （Web 端为同页渲染 + 滚动；小程序拆分为跨 Tab 传递）
   */
  onResultTap(e) {
    const { index } = e.currentTarget.dataset
    const poem = this.data.results[index]
    if (!poem) return
    app.globalData.selectedPoem = poem
    wx.switchTab({ url: '/pages/index/index' })
  },

  /* ══════════ 简繁切换 ══════════ */

  /** 语言切换后重跑当前搜索 */
  onLangChange(e) {
    const { lang } = e.detail
    this.setData({ lang })
    const q = this.data.query.trim()
    if (q) this.runSearch(q)
  }
})
