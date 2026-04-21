const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'hotel.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 创建商品表
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 100,
    image_url TEXT
  )`);

  // 创建呼叫记录表
  db.run(`CREATE TABLE IF NOT EXISTS service_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 插入一些示例数据 (如果表为空)
  db.get("SELECT count(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO products (name, price, category) VALUES (?, ?, ?)");
      stmt.run("可口可乐 330ml", 5.0, "饮料");
      stmt.run("乐事薯片 70g", 8.0, "零食");
      stmt.run("红牛 250ml", 7.0, "饮料");
      stmt.run("机械键盘轴体包", 35.0, "外设");
      stmt.finalize();
      console.log("示例数据已插入。");
    }
  });
});

module.exports = db;
