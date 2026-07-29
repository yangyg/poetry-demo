/**
 * 关于 Tab 逻辑 — 项目介绍与数据来源
 * 静态展示页，无接口请求；仅同步 tabBar 选中态与语言状态
 */
const app = getApp()

Page({
  data: {
    lang: 'zh-Hans'
  },

  onLoad() {
    this.setData({ lang: app.getLang() })
  },

  /** Tab 页每次显示时同步自定义 tabBar 选中态与语言 */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    const currentLang = app.getLang()
    if (currentLang !== this.data.lang) {
      this.setData({ lang: currentLang })
    }
  },

  /** 语言切换（本页为静态文案，仅同步状态以保持导航栏一致） */
  onLangChange(e) {
    const { lang } = e.detail
    this.setData({ lang })
  }
})
