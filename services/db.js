const mysql = require('mysql2/promise');

const logger = require('../logger')

async function query(sql, params) {
  logger.info("Start query ")
  const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
  });
  // connection.connect();

  logger.info("Middle query ")
  logger.info(connection)
  const [results, ] = await connection.execute(sql, params);
  logger.info("End query ")
  logger.info(results)

  return results;
}

module.exports = {
  query
}