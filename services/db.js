const mysql = require('mysql2/promise');

const logger = require('../logger')

async function query(sql, params) {
  logger.info("Start query")
  const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
  });
  logger.info("Middle query ", connection)
  const [results, ] = await connection.execute(sql, params);
  logger.info("End query ", result)

  return results;
}

module.exports = {
  query
}