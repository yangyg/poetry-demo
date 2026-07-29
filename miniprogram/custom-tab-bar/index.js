/**
 * 自定义 tabBar — 宣纸墨韵风格
 * 使用印章式单字图标（诗 / 寻 / 泉），选中态为朱红印泥色
 *
 * 各 Tab 页面需在 onShow 中调用：
 *   this.getTabBar().setData({ selected: 0 | 1 | 2 })
 */
Component({
  data: {
    /** 当前选中索引，由页面 onShow 同步 */
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '诗' },
      { pagePath: '/pages/search/search', text: '搜索', icon: '寻' },
      { pagePath: '/pages/about/about', text: '关于', icon: '泉' }
    ]
  },

  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      if (index === this.data.selected) return
      wx.switchTab({ url: path })
    }
  }
})
