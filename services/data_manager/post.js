const db = require('../db');
const helper = require('../helper');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, process.env.LISTPERPAGE);
  const rows = await db.query(
    `SELECT * FROM post LIMIT ${offset},${process.env.LISTPERPAGE}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getUnique(id){
  const rows = await db.query(
    `SELECT * FROM post WHERE id = ${id} LIMIT 1`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

module.exports = {
  getMultiple
}