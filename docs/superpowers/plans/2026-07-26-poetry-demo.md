# 诗泉 Demo Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Vite 原生前端做一个宣纸墨韵风格的古诗词 demo：随机刷诗 + 全文搜索。

**Architecture:** 单页应用；`api.js` 封装代理请求；`main.js` 负责状态与 DOM；样式独立。开发时经 Vite proxy 访问诗泉 API。

**Tech Stack:** Vite、原生 HTML/CSS/JS、诗泉 REST API

---

## File Structure

- `package.json` — 依赖与脚本
- `vite.config.js` — 开发服务器 + `/api` 代理
- `index.html` — 页面骨架
- `src/main.js` — UI 逻辑与状态
- `src/api.js` — API 调用
- `src/style.css` — 宣纸墨韵样式
- `README.md` — 启动说明

---

### Task 1: Vite 脚手架与代理

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/style.css`, `src/api.js`

- [ ] **Step 1:** 写入 `package.json`（vite 依赖、`dev`/`build`/`preview` 脚本）
- [ ] **Step 2:** 配置 `vite.config.js`，将 `/api` 代理到 `https://poetry.palemoky.com`
- [ ] **Step 3:** `npm install` 并确认 `npm run dev` 可启动

---

### Task 2: API 层

**Files:**
- Create: `src/api.js`

- [ ] **Step 1:** 实现 `fetchRandom(lang)` → `GET /api/poems/random?lang=`
- [ ] **Step 2:** 实现 `searchPoems(q, lang)` → `GET /api/search?q=&lang=`
- [ ] **Step 3:** 统一错误抛出（非 ok 时抛中文可读错误）

---

### Task 3: 页面与交互

**Files:**
- Modify: `index.html`, `src/main.js`, `src/style.css`

- [ ] **Step 1:** 搭建顶栏、阅读区、搜索区、页脚 DOM
- [ ] **Step 2:** 进入页加载随机诗；「换一首」刷新
- [ ] **Step 3:** 搜索提交 → 列表展示；点击条目 → 阅读区展示
- [ ] **Step 4:** 简繁切换后重新请求当前视图
- [ ] **Step 5:** 加载中 / 失败 / 无结果状态

---

### Task 4: 视觉与验收

**Files:**
- Modify: `src/style.css`, `README.md`

- [ ] **Step 1:** 宣纸底、墨色字、印章品牌、2–3 处入场/切换动效
- [ ] **Step 2:** 窄屏可读
- [ ] **Step 3:** 浏览器验证随机与搜索
- [ ] **Step 4:** 更新 README 启动方式

---

## Notes

- 不做筛选、调试台、登录。
- 不主动 git commit（除非用户要求）。
- 字体选用有书法气质的中文网络字体（如马善政楷体 / 思源宋），避免 Inter/系统默认栈作为主视觉。
