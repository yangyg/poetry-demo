# AGENTS.md — AI 编码代理项目指引

## 项目概述

基于 [诗泉 API](https://poetry.palemoky.com/) 的古诗词演示应用，演示两项核心能力：**随机刷诗** + **全文搜索**。

项目包含两个端：

- **Web 端**：单页应用，首屏随机展示一首古诗，支持「换一首」、关键词搜索、简繁切换
- **微信小程序端**：功能与 Web 端一致，位于 `miniprogram/` 目录，使用微信开发者工具打开项目根目录即可运行

## 技术栈

| 端 | 技术 |
|----|------|
| Web | Vite 7 + 原生 HTML/CSS/JS（ES Module），无框架依赖 |
| 小程序 | 微信小程序原生技术栈（WXML / WXSS / JavaScript），`project.config.json` 中 `miniprogramRoot` 指向 `miniprogram/` |

## 目录结构

```
├── src/                        # Web 端源码
│   ├── main.js                 # UI 逻辑与状态管理（原生 DOM 操作）
│   ├── api.js                  # API 调用封装（fetch）
│   └── style.css               # 宣纸墨韵风格样式（CSS 变量在 :root）
├── miniprogram/                # 微信小程序端源码
│   ├── app.js / app.json / app.wxss   # 全局配置与主题变量
│   ├── utils/api.js            # 接口层（wx.request 封装）
│   ├── components/custom-nav/  # 自定义导航栏（印章品牌 + 简繁切换）
│   └── pages/index/            # 唯一页面：阅读区 + 搜索区
├── docs/superpowers/
│   ├── specs/                  # 设计文档（功能范围、接口、错误处理）
│   └── plans/                  # 实现计划（任务拆解）
├── index.html                  # Web 端页面骨架
├── vite.config.js              # 开发服务器 + /api 代理配置
└── project.config.json         # 微信开发者工具项目配置
```

## 开发命令

```bash
npm install        # 安装依赖（仅 vite）
npm run dev        # 启动开发服务器，默认 http://localhost:5173
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

小程序端无构建步骤，用微信开发者工具打开项目根目录直接编译运行。

## 接口与代理配置

- **Web 端**：开发时 `/api` 经 Vite 代理转发到 `https://poetry.palemoky.com`（见 `vite.config.js`），避免 CORS
- **小程序端**：无代理能力，`wx.request` 直接请求 `https://poetry.palemoky.com/api/*`；开发时需在开发者工具中勾选「不校验合法域名」，正式发布需在管理后台添加该域名为 request 合法域名

核心接口：

| 能力 | 接口 | 响应 |
|------|------|------|
| 随机诗 | `GET /api/poems/random?lang=zh-Hans\|zh-Hant` | `data` 字段为诗歌对象 |
| 全文搜索 | `GET /api/search?q=...&lang=...` | `data` 字段为诗歌数组，`pagination` 为分页信息 |

诗歌对象结构：`{ id, title, content: string[], author: { name }, dynasty: { name } }`

## 编码规范与注意事项

1. **Web 端使用原生 DOM 操作**，不引入任何框架或 UI 库
2. **视觉风格为宣纸墨韵**：米黄纸感底色、墨色文字、印章红点缀；CSS 变量定义在 `src/style.css` 的 `:root`（Web）和 `app.wxss` 的 `page`（小程序），修改样式时保持一致
3. **小程序端使用 `wx.request`** 替代浏览器的 fetch；CSS 不支持 `color-mix()`，已预计算为 rgba 值
4. **小程序字体**使用系统楷体/宋体回退栈（无法直接加载 Google Fonts）
5. **简繁切换**通过 `lang` 参数（`zh-Hans` / `zh-Hant`）传递给接口，小程序端语言偏好持久化在 Storage
6. **不主动 git commit**，除非用户明确要求
7. 不做：作者/朝代/体裁复杂筛选、API 调试台、登录/后端/自建数据库

## 设计文档

- 设计规范：`docs/superpowers/specs/2026-07-26-poetry-demo-design.md`
- 实现计划：`docs/superpowers/plans/2026-07-26-poetry-demo.md`
