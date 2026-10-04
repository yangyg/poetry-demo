# AGENTS.md — AI 编码代理项目指引

## 项目概述

基于 [诗泉 API](https://poetry.palemoky.com/) 的古诗词演示应用，演示两项核心能力：**随机刷诗** + **全文搜索**。

项目包含两个端：

- **Web 端**：首页阅读、搜索、诗详情、关于四个页面，导航条位于顶部 Header 内，支持「换一首」与简繁切换
- **微信小程序端**：功能与 Web 端一致，位于 `miniprogram/` 目录，使用微信开发者工具打开项目根目录即可运行

## 技术栈

| 端 | 技术 |
|----|------|
| Web | Astro 7 + 原生 .astro 组件 + 原生 TypeScript（无框架依赖），直连诗泉 API（见 `src/lib/api.ts`） |
| 小程序 | 微信小程序原生技术栈（WXML / WXSS / JavaScript），`project.config.json` 中 `miniprogramRoot` 指向 `miniprogram/` |

## 目录结构

```
├── src/                        # Web 端源码（Astro）
│   ├── layouts/Layout.astro    # HTML 骨架 + Google Fonts + 全局样式引入
│   ├── components/
│   │   └── SiteHeader.astro    # 顶栏（页面导航 + 简繁切换，单行布局）
│   ├── pages/
│   │   ├── index.astro         # Tab 页：阅读区
│   │   ├── search.astro        # Tab 页：搜索区
│   │   ├── poem.astro          # 诗详情页（/poem/?id=，按 id 动态取诗）
│   │   └── about.astro         # Tab 页：关于（项目介绍 + 数据来源）
│   ├── scripts/                # 各页 <script> 入口逻辑（原生 DOM 操作）
│   │   ├── reader.ts           # 首页：随机取诗/换一首
│   │   ├── search.ts           # 搜索页：搜索 + 点击结果跳转详情页
│   │   ├── poem.ts             # 详情页：按 id 取诗渲染，语言切换后重取
│   │   └── about.ts            # 关于页：语言偏好持久化
│   ├── lib/
│   │   ├── api.ts              # API 调用封装（fetch + TypeScript 类型）
│   │   ├── poem-view.ts        # 首页阅读区/详情页共享的诗歌渲染辅助
│   │   └── lang.ts             # 语言偏好（localStorage + 下拉框绑定）
│   └── styles/global.css       # 宣纸墨韵风格样式（CSS 变量在 :root）
├── miniprogram/                # 微信小程序端源码
│   ├── app.js / app.json / app.wxss   # 全局配置与主题变量
│   ├── utils/api.js            # 接口层（wx.request 封装）
│   ├── components/custom-nav/  # 自定义导航栏（印章品牌 + 简繁切换）
│   ├── custom-tab-bar/         # 自定义底部 TabBar（首页 / 搜索 / 关于）
│   └── pages/index/            # Tab 页：阅读区
│   └── pages/search/           # Tab 页：搜索区
│   └── pages/about/            # Tab 页：关于（项目介绍 + 数据来源）
├── docs/superpowers/
│   ├── specs/                  # 设计文档（功能范围、接口、错误处理）
│   └── plans/                  # 实现计划（任务拆解）
├── astro.config.mjs            # Astro 配置
├── tsconfig.json               # 继承 astro/tsconfigs/strict
└── project.config.json         # 微信开发者工具项目配置
```

## 开发命令

```bash
npm install        # 安装依赖（仅 astro）
npm run dev        # 启动 Astro 开发服务器，默认 http://localhost:4321
npm run build      # 生产构建（输出到 dist/）
npm run preview    # 预览构建产物
```

小程序端无构建步骤，用微信开发者工具打开项目根目录直接编译运行。

## 接口配置

- **Web 端**：浏览器直连 `https://poetry.palemoky.com`（接口已开启 CORS，`Access-Control-Allow-Origin: *`），API 地址常量在 `src/lib/api.ts` 的 `API_BASE`
- **小程序端**：`wx.request` 直接请求 `https://poetry.palemoky.com/api/*`；开发时需在开发者工具中勾选「不校验合法域名」，正式发布需在管理后台添加该域名为 request 合法域名

核心接口：

| 能力 | 接口 | 响应 |
|------|------|------|
| 随机诗 | `GET /api/poems/random?lang=zh-Hans\|zh-Hant` | `data` 字段为诗歌对象 |
| 全文搜索 | `GET /api/search?q=...&lang=...` | `data` 字段为诗歌数组，`pagination` 为分页信息 |

诗歌对象结构：`{ id, title, content: string[], author: { name }, dynasty: { name } }`

## 编码规范与注意事项

1. **Web 端使用原生 DOM 操作**（逻辑按页面拆分在 `src/scripts/`，由各页 `<script>` 引入），不引入任何框架或 UI 库；语言偏好存 `localStorage`
2. **Web 端启用 Astro ClientRouter（View Transitions）**：页面脚本模块只执行一次，DOM 查询与事件绑定必须放在 `document.addEventListener('astro:page-load', ...)` 内（见 `src/scripts/*`），否则转场后页面失绑
3. **视觉风格为「墨韵手卷」**：米黄纸感底色、墨色文字、印章红点缀、逐行落墨/钤印动效；诗文默认横排（现代阅读习惯），竖排手卷为可切换版式（`.layout-switch`，偏好存 localStorage `poetry-layout`）；CSS 变量定义在 `src/styles/global.css` 的 `:root`（Web）和 `app.wxss` 的 `page`（小程序），修改样式时保持一致；动效只用 transform/opacity，并尊重 `prefers-reduced-motion`
4. **小程序端使用 `wx.request`** 替代浏览器的 fetch；CSS 不支持 `color-mix()`，已预计算为 rgba 值
4. **小程序字体**使用系统楷体/宋体回退栈（无法直接加载 Google Fonts）
5. **简繁切换**通过 `lang` 参数（`zh-Hans` / `zh-Hant`）传递给接口，语言偏好持久化在 Storage（Web 端 localStorage、小程序端 Storage），跨页保持一致；注意接口的搜索语料按语言区分，简体查询词在 zh-Hant 下可能无结果
6. **不主动 git commit**，除非用户明确要求
7. 不做：作者/朝代/体裁复杂筛选、API 调试台、登录/后端/自建数据库

## 设计文档

- 设计规范：`docs/superpowers/specs/2026-07-26-poetry-demo-design.md`
- 实现计划：`docs/superpowers/plans/2026-07-26-poetry-demo.md`
