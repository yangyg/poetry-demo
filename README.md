# 诗泉 Demo

基于 [诗泉](https://poetry.palemoky.com/) 的古诗词 **随机阅读 + 全文搜索** 演示。

## 启动

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（通常是 `http://localhost:5173`）。

## 功能

- 进入页面随机一首诗，「换一首」继续刷
- 关键词搜索，点击结果在上方阅读
- 简繁切换

开发时 `/api` 经 Vite 代理到 `https://poetry.palemoky.com`，避免 CORS 问题。
