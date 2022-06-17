const db = require('../db');
const helper = require('../helper');
const image_manager = require('./image_manager');

async function getMultiple(type)
{
  const rows = await db.query(
    'SELECT R.id AS id, R.type as type, R.name as name, R.instagram as instagram, R.web as web, R.showDate as showDate, '+
            'RI.image_id as image_id, RI.image_path as image_path '+
    'FROM resources AS R LEFT JOIN resources_image AS RI ON  R.id = RI.resource_id '+
    'WHERE R.type = ? AND (R.showDate IS NULL OR R.showDate <= NOW()) '+
    'ORDER BY id, image_id',
    [type]);
  const data = helper.groupRows(rows, "images", ["image_id", "image_path"]);
  return {
    data
  }
}

async function getAll()
{
  const rows = await db.query(
    'SELECT R.id AS id, R.type as type, R.name as name, R.instagram as instagram, R.web as web, R.showDate as showDate, '+
            'RI.image_id as image_id, RI.image_path as image_path '+
    'FROM resources AS R LEFT JOIN resources_image AS RI ON  R.id = RI.resource_id ');
    const data = helper.groupRows(rows, "images", ["image_id", "image_path"]);

  return data
}

async function create(resource)
{
  const result = await db.query(
    'INSERT INTO resources (name, type, instagram, web, showDate) VALUES (?, ?, ?, ?, ?)',
    [resource.name, resource.type, resource.instagram, resource.web, 
      resource.showDate != null ? new Date(resource.showDate) : null]
  );
  resource.id = result.insertId

  return resource;
}

async function update(resource)
{
  const result = await db.query(
    'UPDATE resources SET name = ?, type = ?, instagram = ?, web = ?, showDate = ? WHERE id = ?',
    [resource.name, resource.type, resource.instagram, resource.web, 
      resource.showDate != null ? new Date(resource.showDate) : null, resource.id]
  );

  let status = 400;
  if (result.affectedRows) {
    status = 200
  }
  return { status };
}

async function remove(id)
{
  let status = 400;

  result = await db.query('DELETE FROM resources_image WHERE resource_id = ?', [id]);

  result = await db.query('DELETE FROM resources WHERE id = ?', [id]);

  if (result.affectedRows) {
    status = 200
    image_manager.removeImage(`resources/${id}/`)
  }

  return { status };
}

async function createImage(resource)
{
  let image_path = image_manager.uploadImage(resource.image_path, `resources/${resource.resource_id}`)
  let image_id = image_path.split(/[/.]+/).slice(-2, -1)[0]

  const result = await db.query(
    'INSERT INTO resources_image (resource_id, image_id, image_path) VALUES (?, ?, ?)',
    [resource.resource_id, image_id, image_path]
  );

  resource.image_id = image_id;
  resource.image_path = image_path;

  return resource;
}

async function removeImage(resource_id, image_id)
{
  const result = await db.query('DELETE FROM resources_image WHERE resource_id = ? AND image_id = ?', [resource_id, image_id]);

  let status = 400;
  if (result.affectedRows) {
    status = 200
    image_manager.removeImage(`resources/${resource_id}/${image_id}.jpg`)
  }
  return { status };
}

module.exports = {
  getMultiple,
  getAll,
  create,
  update,
  remove,
  createImage,
  removeImage
}