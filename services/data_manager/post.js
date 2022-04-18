const db = require('../db');
const helper = require('../helper');
// const config = require('../../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, process.env.LISTPERPAGE || 10);
  const rows = await db.query(
    /*`SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
    FROM programming_languages LIMIT ${offset},${config.listPerPage}`*/
    'SELECT * FROM post ' 
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

module.exports = {
  getMultiple
}