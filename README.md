# 诗泉 Demo

基于 [诗泉](https://poetry.palemoky.com/) 的古诗词 **随机阅读 + 全文搜索** 演示。

## 启动

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（通常是 `http://localhost:4321`）。

## 功能

Web 端与小程序端均为三个页面（首页 / 搜索 / 关于）：

- **首页**：进入随机展示一首古诗，「换一首」继续刷
- **搜索**：关键词搜索（q 至少 3 个字符），点击结果进入诗详情页
- **诗详情**（Web 端）：`/poem/?id=` 按 id 展示诗文，支持简繁切换
- **关于**：项目介绍与数据来源
- 简繁切换（各页共享，Web 端持久化在 localStorage）

Web 端导航条在顶部 Header 内；小程序端为底部 TabBar 切换。

开发时 `/api` 经 Astro 开发服务器（Vite 代理，见 `astro.config.mjs`）转发到 `https://poetry.palemoky.com`，避免 CORS 问题。

## 小程序版

微信小程序版本位于 `miniprogram/` 目录，用微信开发者工具打开项目根目录直接编译运行，无需构建。
