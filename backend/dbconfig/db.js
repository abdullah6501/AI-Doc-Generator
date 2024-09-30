const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'login'
  // database: 'proport'
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the database");
});

connection.on('error', (err) => {
    console.log('MySQL connection error:', err);

  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to MySQL...');
    connection.connect();
  } else {
    throw err;
  }
});

module.exports = connection;
