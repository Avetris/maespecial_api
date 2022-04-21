const db = require('../db');
const helper = require('../helper');
const jsdom = require("jsdom");
const fs = require('fs');

async function getMultiple(pageSize = process.env.LISTPERPAGE, page = 0)
{
  const offset = helper.getOffset(Number(page) + 1, pageSize);
  const rows = await db.query(
    `SELECT id, title, description, image, publishDate FROM post LIMIT ${offset},${pageSize}`
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
  const result = await db.query(
    'INSERT INTO post (title, description, image, content, publishDate) VALUES (?, ?, ?, ?, NOW())',
    ["tmp", "tmp", "tmp", "tmp"]
  );
  post.id = result.insertId

  return update(post);
}

async function update(post)
{
  const doc = new jsdom.JSDOM(post.content)
  doc.window.document.querySelectorAll("img").forEach(img =>
  {
    if (img.alt) {
      img.src = uploadImage(img.src, img.alt, post.id)
      img.alt = ""
    }
  })
  post.content = doc.window.document.body.innerHTML;
  if (post.image.startsWith("data")) post.image = uploadImage(post.image, "post_image.jpg", post.id)

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
    fs.rmSync(`../blog_images/${id}/`, { recursive: true, force: true });
  }
  return { status };
}

function uploadImage(file_base64, filename, postId)
{
  let path = `../blog_images/${postId}/`
  //Use the name of the input field to retrieve the uploaded file
  decodeBase64(file_base64, path, filename);

  if (process.env.NODE_ENV == 'production') {
    return `./data/${postId}/${filename}`;
  } else {
    return `http://localhost:${process.env.PORT}/data/${postId}/${filename}`;
  }
}

function decodeBase64(file_base64, path, filename)
{
  const ext = file_base64.substring(file_base64.indexOf("/") + 1, file_base64.indexOf(";base64"));
  const fileType = file_base64.substring("data:".length, file_base64.indexOf("/"));
  //Forming regex to extract base64 data of file.
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
  //Extract base64 data.
  const base64Data = file_base64.replace(regex, "");

  fs.mkdir(path, { recursive: true }, (err) => { if (err) throw err; });

  fs.writeFileSync(path + filename, base64Data, 'base64');
}

module.exports = {
  getMultiple,
  getUnique,
  create,
  update,
  remove
}