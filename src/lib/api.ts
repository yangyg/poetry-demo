/**
 * 诗泉 API 客户端（接口已开启 CORS，开发与生产环境均直连）
 */

export type Lang = 'zh-Hans' | 'zh-Hant'

const API_BASE = 'https://poetry.palemoky.com'

export interface Poem {
  id?: number
  title?: string
  content?: string[]
  author?: { name: string }
  dynasty?: { name: string }
  type?: { name: string }
}

interface Envelope<T> {
  data: T
  pagination?: unknown
}

interface ErrorBody {
  error?: { code?: string; message?: string }
  message?: string
}

/** 已知错误原文 → 中文；命中则显示纯中文提示 */
const MESSAGE_I18N: Record<string, string> = {
  'q must be at least 3 characters': '关键词至少需要 3 个字符',
  'Poem not found': '没有找到这首诗',
}

/** 已知错误码 → 中文；同码可能对应多种原因，附上接口原文 */
const CODE_I18N: Record<string, string> = {
  BAD_REQUEST: '请求参数有误',
  NOT_FOUND: '请求的接口不存在',
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ErrorBody
    const code = body.error?.code
    const msg = body.error?.message ?? body.message
    if (msg && MESSAGE_I18N[msg]) return MESSAGE_I18N[msg]
    if (code && CODE_I18N[code]) {
      return msg ? `${CODE_I18N[code]}（${msg}）` : CODE_I18N[code]
    }
    if (msg) return msg
  } catch {
    // 响应体不是 JSON（如网关错误页），退回状态码提示
  }
  return `请求失败（${res.status}）`
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(await errorMessage(res))
  }
  return res.json() as Promise<T>
}

export async function fetchRandom(lang: Lang): Promise<Poem> {
  const data = await request<Envelope<Poem>>(
    `/api/poems/random?lang=${encodeURIComponent(lang)}`
  )
  return data.data
}

export async function fetchPoemById(id: number, lang: Lang): Promise<Poem> {
  const data = await request<Envelope<Poem>>(
    `/api/poems/${id}?lang=${encodeURIComponent(lang)}`
  )
  return data.data
}

export async function searchPoems(q: string, lang: Lang) {
  const params = new URLSearchParams({ q, lang })
  const data = await request<Envelope<Poem[] | null>>(`/api/search?${params}`)
  return {
    poems: data.data ?? [],
    pagination: data.pagination,
  }
}
