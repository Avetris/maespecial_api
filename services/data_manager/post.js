const image_manager = require('./image_manager');
const db = require('../db');
const helper = require('../helper');
const jsdom = require("jsdom");
const logger = require('../../logger');

async function getMultiple(showall, pageSize = process.env.LISTPERPAGE, page = 0)
{
  const offset = helper.getOffset(Number(page) + 1, pageSize);
  const rows = await db.query(
    `SELECT id, title, description, image, publishDate FROM post 
    ${!showall ? 'WHERE publishDate < NOW() ' : ''}ORDER BY publishDate DESC, id ASC LIMIT ${offset},${pageSize}`
  );
  const data = helper.emptyOrRows(rows);

  const length_result = await db.query('SELECT COUNT(*) AS Length FROM post');
  const length = length_result[0].Length
  const meta = {page, pageSize, length }

  return {
    data,
    meta
  }
}

async function getUnique(id)
{
  const rows = await db.query(
    `SELECT * FROM post WHERE id = ${id} LIMIT 1`
  );
  return helper.emptyOrUnique(rows);
}

async function create(post)
{
  logger.info("create")
  logger.info(post.publishDate)
  const result = await db.query(
    'INSERT INTO post (title, description, image, content, publishDate) VALUES (?, ?, ?, ?, NOW())',
    ["tmp", "tmp", "tmp", "tmp"]
  );
  post.id = result.insertId

  return update(post);
}

async function update(post)
{
  logger.info("update")
  logger.info(post.publishDate)
  const doc = new jsdom.JSDOM(post.content)
  doc.window.document.querySelectorAll("img").forEach(img =>
  {
    if (img.alt) {
      img.src = image_manager.uploadImage(img.src, `post/${post.id}`)
      img.alt = ""
    }
  })
  post.content = doc.window.document.body.innerHTML;
  if (post.image.startsWith("data")) post.image = image_manager.uploadImage(post.image, `post/${post.id}`)

  return updateSQL(post.id, post);
}

async function updateSQL(id, post)
{
  const result = await db.query(
    'UPDATE post SET title = ?, description = ?, image = ?, content = ?, publishDate = ? WHERE id = ?',
    [post.title, post.description, post.image, post.content, new Date(post.publishDate), id]
  );

  let status = 400;
  if (result.affectedRows) {
    status = 200
  }
  return { status };
}

async function remove(id)
{
  const result = await db.query('DELETE FROM post WHERE id = ?', [id]);

  let status = 400;
  if (result.affectedRows) {
    status = 200;
    image_manager.removeImage(`post/${id}/`)
  }
  return { status };
}

module.exports = {
  getMultiple,
  getUnique,
  create,
  update,
  remove
}