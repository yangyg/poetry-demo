App({
  globalData: {
    /** 当前语言：zh-Hans | zh-Hant */
    lang: 'zh-Hans'
  },

  onLaunch() {
    // 恢复上次选择的语言
    const saved = wx.getStorageSync('lang')
    if (saved === 'zh-Hans' || saved === 'zh-Hant') {
      this.globalData.lang = saved
    }
  },

  /** 获取当前语言 */
  getLang() {
    return this.globalData.lang
  },

  /** 切换语言并持久化 */
  setLang(lang) {
    this.globalData.lang = lang
    wx.setStorageSync('lang', lang)
  }
})
