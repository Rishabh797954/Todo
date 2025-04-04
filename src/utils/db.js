import mysql from 'mysql';

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dypiu',
    database: 'todo_app',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
    } else {
      console.log('Connected to database.');
    }
  });

  db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect on connection loss
    } else {
      throw err;
    }
  });
}

handleDisconnect();

export function query(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        console.error('Query error:', error);
        return reject(error);
      }
      resolve(results);
    });
  });
}

export function closeConnection() {
  db.end(err => {
    if (err) {
      console.error('Error closing the database connection:', err.stack);
    } else {
      console.log('Database connection closed.');
    }
  });
}