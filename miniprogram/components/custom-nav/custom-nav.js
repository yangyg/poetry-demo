const app = getApp()

Component({
  options: {
    multipleSlots: true
  },

  properties: {
    /** 当前语言 */
    lang: {
      type: String,
      value: 'zh-Hans'
    }
  },

  data: {
    statusBarHeight: 20,
    navHeight: 44,
    langOptions: ['简体', '繁體'],
    langIndex: 0
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getWindowInfo()
      const statusBarHeight = sysInfo.statusBarHeight || 20
      // 胶囊按钮位置信息，用于计算导航栏高度
      const menuBtn = wx.getMenuButtonBoundingClientRect()
      const navHeight =
        (menuBtn.top - statusBarHeight) * 2 + menuBtn.height
      this.setData({
        statusBarHeight,
        navHeight,
        langIndex: this.properties.lang === 'zh-Hant' ? 1 : 0
      })
    }
  },

  methods: {
    onLangChange(e) {
      const index = Number(e.detail.value)
      if (index === this.data.langIndex) return
      const lang = index === 1 ? 'zh-Hant' : 'zh-Hans'
      this.setData({ langIndex: index })
      app.setLang(lang)
      this.triggerEvent('langchange', { lang })
    }
  }
})
