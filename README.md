# 温渡 (Wendu) - 酒店/公共场所服务管理系统

“温渡”是一个基于 Vue 3 和 Node.js 开发的轻量级、响应式服务管理系统。它旨在为酒店、共享空间或类似场所提供便捷的客户呼叫服务及商品管理功能。

## 🌟 项目亮点

- **实时呼叫系统**：利用 Socket.io 实现客户与管理端的即时通讯，确保服务响应零延迟。
- **高级商品排序**：内置专业级**拖拽排序**功能，支持“原行克隆”幻影效果及平滑的“挤开”动画，操作手感极其顺滑且支持滑轮滚动。
- **优化支付流程**：采用更符合现场服务逻辑的“确认下单 + 现场收款”模式，简化用户操作，提升交易信任度。
- **现代化技术栈**：采用 Vue 3 (Composition API) + Vite 8 + Tailwind CSS 4 构建，性能卓越，界面美观。
- **布局稳定性**：针对管理后台进行了 UI 深度优化，确保长请求内容下表格不换行、不挤压，排版始终整洁。
- **轻量级存储**：使用 SQLite 数据库，并具备架构自动升级逻辑，无需额外配置复杂的数据库环境。

## 🛠️ 技术栈

### 前端 (Frontend)
- **框架**: [Vue 3](https://vuejs.org/) (TypeScript)
- **构建工具**: [Vite 8](https://vitejs.dev/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **动画**: Vue Transition Group + CSS Transform 硬件加速
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **图标**: [Lucide-vue-next](https://lucide.dev/)

### 后端 (Backend)
- **服务器**: [Express](https://expressjs.com/) (Node.js)
- **进程管理**: 完美支持 [PM2](https://pm2.keymetrics.io/) 稳定运行
- **实时通讯**: [Socket.io](https://socket.io/)
- **数据库**: [SQLite3](https://www.sqlite.org/index.html)
- **文件上传**: [Multer](https://github.com/expressjs/multer)

---

## 🚀 部署详细步骤

请按照以下步骤在本地或服务器上部署此项目：

### 1. 克隆项目
```bash
git clone https://github.com/huheshuangxing/wendu.git
cd wendu
```

### 2. 前端配置与安装
1. 进入根目录安装依赖：
   ```bash
   npm install
   ```
2. 修改配置文件 (可选)：
   打开 `src/config.ts`，确保 `API_BASE_URL` 指向您的后端服务器地址。

### 3. 后端配置与安装
1. 进入服务器目录：
   ```bash
   cd server
   npm install
   ```
2. 运行环境：
   确保安装了 Node.js。建议使用 PM2 运行：`pm2 start server.js --name wendu-backend`。

### 4. 运行项目
- **开发环境**: `npm run dev`
- **生产打包**: `npm run build` (生成的 `dist` 目录可部署至 Nginx)

---

## 🔑 管理员后台
- **访问地址**: `/login`
- **默认密码**: `wendu888`
- **功能**: 
  - 实时接收并处理客户呼叫记录。
  - **自定义商品顺序**：通过拖拽图标自由调整商品展示顺序，新商品默认自动置顶。
  - 管理饮品、零食及外设设备的库存与价格。
  - 快捷图片上传与展示。

## 📁 目录结构
- `/src`: 前端 Vue 源码
- `/server`: 后端 Express 源码及 SQLite 数据库
- `/server/uploads`: 存放已上传的商品图片
- `/public`: 静态资源文件

## 📄 开源协议
本项目遵循 MIT 协议。
