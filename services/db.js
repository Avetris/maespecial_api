const mysql = require('mysql2/promise');

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbdatabase
  });
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}