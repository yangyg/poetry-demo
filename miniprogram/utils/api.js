/**
 * 诗泉 API 客户端（小程序版）
 * Web 端经 Vite 代理请求 /api/*，小程序无代理能力，
 * 改为直接请求 https://poetry.palemoky.com/api/*
 *
 * ⚠️ 注意：正式发布需在小程序管理后台将 poetry.palemoky.com
 *    添加到「request 合法域名」；开发阶段可在开发者工具中
 *    勾选「不校验合法域名」。
 */

const BASE_URL = 'https://poetry.palemoky.com/api'

/**
 * 通用请求封装（Promise 化的 wx.request）
 * @param {string} path - 相对路径，如 /poems/random?lang=zh-Hans
 * @returns {Promise<any>} 响应 JSON
 */
function request(path) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败（${res.statusCode}）`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络异常，请检查连接'))
      }
    })
  })
}

/**
 * 随机获取一首诗
 * @param {string} lang - zh-Hans | zh-Hant
 * @returns {Promise<object>} 诗歌对象
 */
function fetchRandom(lang) {
  return request(`/poems/random?lang=${encodeURIComponent(lang)}`).then(
    (data) => data.data
  )
}

/**
 * 全文搜索诗词
 * @param {string} q - 关键词
 * @param {string} lang - zh-Hans | zh-Hant
 * @returns {Promise<{poems: object[], pagination: object}>}
 */
function searchPoems(q, lang) {
  const params = `q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`
  return request(`/search?${params}`).then((data) => ({
    poems: data.data || [],
    pagination: data.pagination
  }))
}

module.exports = { fetchRandom, searchPoems }
