# 温渡 (Wendu) - 酒店/公共场所服务管理系统

“温渡”是一个基于 Vue 3 和 Node.js 开发的轻量级、响应式服务管理系统。它旨在为酒店、共享空间或类似场所提供便捷的客户呼叫服务及商品管理功能。

## 🌟 项目亮点

- **实时呼叫系统**：利用 Socket.io 实现客户与管理端的即时通讯，确保服务响应零延迟。
- **现代化技术栈**：采用 Vue 3 (Composition API) + Vite 8 + Tailwind CSS 4 构建，性能卓越，界面美观。
- **商品管理后台**：内置完整的商品管理功能，支持 CRUD 操作及图片上传，方便随时调整服务内容。
- **轻量级存储**：使用 SQLite 数据库，无需额外配置复杂的数据库环境。

## 🛠️ 技术栈

### 前端 (Frontend)
- **框架**: [Vue 3](https://vuejs.org/) (TypeScript)
- **构建工具**: [Vite 8](https://vitejs.dev/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/) & [Headless UI](https://headlessui.com/)
- **图标**: [Lucide-vue-next](https://lucide.dev/)

### 后端 (Backend)
- **服务器**: [Express](https://expressjs.com/) (Node.js)
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
   打开 `src/config.ts`，确保 `API_BASE_URL` 指向您的后端服务器地址（本地默认为 `http://localhost:3000`）。

### 3. 后端配置与安装
1. 进入服务器目录：
   ```bash
   cd server
   ```
2. 安装后端依赖：
   ```bash
   npm install
   ```
3. 数据库初始化：
   后端服务器在首次启动时会自动创建 `hotel.db` 数据库文件并插入示例数据。

### 4. 运行项目
建议在两个不同的终端窗口中运行：

- **终端 A (启动后端)**:
  ```bash
  cd server
  npm start
  ```
  后端将运行在 `http://localhost:3000`。

- **终端 B (启动前端)**:
  ```bash
  npm run dev
  ```
  前端将运行在 `http://localhost:5173`。

---

## 🔑 管理员后台
- **访问地址**: `http://localhost:5173/login`
- **默认密码**: `wendu888`
- **功能**: 
  - 实时接收并处理客户呼叫记录。
  - 管理饮品、零食及外设设备的库存与价格。
  - 上传商品展示图片。

## 📁 目录结构
- `/src`: 前端 Vue 源码
- `/server`: 后端 Express 源码及 SQLite 数据库
- `/server/uploads`: 存放已上传的商品图片
- `/public`: 静态资源文件

## 📄 开源协议
本项目遵循 MIT 协议。
