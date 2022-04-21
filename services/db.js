const mysql = require('mysql2/promise');

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
  });
  const [results, ] = await connection.execute(sql, params);

  connection.end();

  return results;
}

module.exports = {
  query
}