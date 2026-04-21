const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

const app = express();
const server = http.createServer(app);

// 初始化 Socket.io 并处理跨域
const io = new Server(server, {
  cors: {
    origin: "*", // 允许所有来源 (本地局域网环境)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// 静态文件服务：提供上传的图片访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API: 图片上传接口
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// API: 登录接口
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === 'wendu888') {
    res.json({ token: 'admin-token-123' });
  } else {
    res.status(401).json({ error: '密码错误' });
  }
});

// API: 商品查询 (搜索或返回全部)
app.get('/api/products', (req, res) => {
  const query = req.query.q;
  if (query) {
    const searchTerm = `%${query}%`;
    db.all("SELECT * FROM products WHERE name LIKE ?", [searchTerm], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// API: 新增商品
app.post('/api/products', (req, res) => {
  const { name, price, category, stock, image_url } = req.body;
  const sql = "INSERT INTO products (name, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [name, price, category, stock || 0, image_url || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, price, category, stock: stock || 0, image_url: image_url || null });
  });
});

// API: 修改商品 (包含库存管理)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock, image_url } = req.body;
  const sql = "UPDATE products SET name = ?, price = ?, category = ?, stock = ?, image_url = ? WHERE id = ?";
  db.run(sql, [name, price, category, stock, image_url, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "商品不存在" });
    res.json({ message: "更新成功" });
  });
});

// API: 下架/删除商品
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "商品不存在" });
    res.json({ message: "删除成功" });
  });
});

// API: 获取历史呼叫记录
app.get('/api/service_calls', (req, res) => {
  db.all("SELECT * FROM service_calls ORDER BY created_at DESC LIMIT 50", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: 更新呼叫状态
app.put('/api/service_calls/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE service_calls SET status = ? WHERE id = ?";
  db.run(sql, [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "记录不存在" });
    res.json({ message: "更新成功" });
  });
});

// API: 删除呼叫记录
app.delete('/api/service_calls/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM service_calls WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "记录不存在" });
    res.json({ message: "删除成功" });
  });
});

// API: 提交订单并扣减库存
app.post('/api/orders', (req, res) => {
  const { items } = req.body;
  console.log('收到订单请求:', items);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '无效的订单数据' });
  }

  // 使用 Promise 封装数据库操作以便更好地控制异步流程
  const updateStock = (item) => {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [item.quantity, item.id, item.quantity],
        function(err) {
          if (err) {
            console.error(`更新库存出错 [ID: ${item.id}]:`, err.message);
            return reject(err);
          }
          if (this.changes === 0) {
            console.warn(`库存不足或商品不存在 [ID: ${item.id}]`);
            return reject(new Error(`商品 [ID: ${item.id}] 库存不足`));
          }
          resolve();
        }
      );
    });
  };

  db.serialize(async () => {
    db.run("BEGIN TRANSACTION");
    
    try {
      for (const item of items) {
        await updateStock(item);
      }
      db.run("COMMIT", (err) => {
        if (err) throw err;
        console.log('订单处理成功');
        res.json({ message: '订单处理成功' });
      });
    } catch (error) {
      db.run("ROLLBACK");
      console.error('订单处理失败，已回滚:', error.message);
      res.status(400).json({ error: error.message || '订单处理失败' });
    }
  });
});

// Socket.io 实时通讯逻辑
io.on('connection', (socket) => {
  console.log('用户已连接:', socket.id);

  // 处理客人端的呼叫事件
  socket.on('guest-call', (data) => {
    console.log('收到实时呼叫:', data);
    const { room_number, type } = data;

    // 1. 将呼叫记录存入数据库
    db.run("INSERT INTO service_calls (room_number, type) VALUES (?, ?)", [room_number, type], function(err) {
      if (err) return console.error(err.message);
      
      const newCall = {
        id: this.lastID,
        room_number,
        type,
        status: 'pending',
        created_at: new Date()
      };

      // 2. 广播给所有客户端 (特别是管理员端)
      io.emit('new-service-call', newCall);
    });
  });

  socket.on('disconnect', () => {
    console.log('用户已断开连接');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js 后端服务器运行在 http://localhost:${PORT}`);
  console.log(`局域网访问请使用本地 IP，例如: http://192.168.x.x:${PORT}`);
});
