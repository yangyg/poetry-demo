/**
 * 诗泉 API 客户端（经 Vite 代理）
 */

async function request(path) {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`请求失败（${res.status}）`)
  }
  return res.json()
}

/** @param {string} lang */
export async function fetchRandom(lang) {
  const data = await request(`/api/poems/random?lang=${encodeURIComponent(lang)}`)
  return data.data
}

/**
 * @param {string} q
 * @param {string} lang
 */
export async function searchPoems(q, lang) {
  const params = new URLSearchParams({ q, lang })
  const data = await request(`/api/search?${params}`)
  return {
    poems: data.data ?? [],
    pagination: data.pagination,
  }
}
