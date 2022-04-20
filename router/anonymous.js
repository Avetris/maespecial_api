var express = require('express');

var router = express.Router();

const post = require('../services/data_manager/post');
const resources = require('../services/data_manager/resource');

router.get('/', function(req, res, next) {
    res.send('Express RESTful API');
});

router.get('/resources', async (req, res) => {
    try {
        res.json(await resources.getMultiple(req.query.type));
    } catch (err) {
        console.error(`Error while getting resources `, err.message);
    }
});

router.get('/posts', async (req, res) => {
    try {
        res.json(await post.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting posts `, err.message);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        res.json(await post.getUnique(req.query.id));
    } catch (err) {
        console.error(`Error while getting post ${req.query.id} `, err.message);
    }
});

module.exports = router;