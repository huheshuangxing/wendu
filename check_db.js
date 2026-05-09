const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'server', 'hotel.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("PRAGMA table_info(products)", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Products table info:");
    console.table(rows);
  });

  db.all("SELECT id, name, sort_order FROM products ORDER BY sort_order ASC, id DESC LIMIT 10", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Current top 10 products:");
    console.table(rows);
  });
});
db.close();
