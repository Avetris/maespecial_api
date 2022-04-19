const mysql = require('mysql2');

const logger = require('../logger')

async function query(sql, params) {
  logger.info("Start query ", process.env.DBHOST, process.env.DBUSER, process.env.DBPASSWORD, process.env.DBDATABASE)
  logger.info(process.env.DBHOST)
  const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
  });

  logger.info("Middle query ", connection)
  const [results, ] = connection.execute(sql, params);
  logger.info("End query ", result)

  return results;
}

module.exports = {
  query
}