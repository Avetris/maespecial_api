const db = require('../db');
const helper = require('../helper');

async function getMultiple(type)
{
  const rows = await db.query('SELECT * FROM resources WHERE type = ? AND (showDate IS NULL OR showDate <= NOW())', [type]);
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function getAll()
{
  const rows = await db.query('SELECT * FROM resources');
  const data = helper.emptyOrRows(rows);

  return data
}

async function create(resource)
{
  const result = await db.query(
    'INSERT INTO resources (name, type, instagram, web, showDate) VALUES (?, ?, ?, ?, ?)',
    [resource.name, resource.type, resource.instagram, resource.web, new Date(resource.showDate)]
  );
  resource.id = result.insertId

  return resource;
}

async function update(resource)
{
  const result = await db.query(
    'UPDATE resources SET name = ?, type = ?, instagram = ?, web = ?, showDate = ? WHERE id = ?',
    [resource.name, resource.type, resource.instagram, resource.web, new Date(resource.showDate), resource.id]
  );

  let status = 400;
  if (result.affectedRows) {
    status = 200
  }
  return { status };
}

async function remove(id)
{
  const result = await db.query('DELETE FROM resources WHERE id = ?', [id]);

  let status = 400;
  if (result.affectedRows) {
    status = 200
  }
  return { status };
}

module.exports = {
  getMultiple,
  getAll,
  create,
  update,
  remove
}