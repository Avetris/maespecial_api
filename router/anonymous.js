var express = require('express');

var router = express.Router();

const post = require('../services/data_manager/post');
const resources = require('../services/data_manager/resource');

const logger = require('../logger')

router.get('/resources', async (req, res) => {
    try {
        res.json(await resources.getMultiple(req.query.type));
    } catch (err) {
        logger.error(`Error while getting resources `, err);
        res.status(400).send({
            error: "Error while getting resources"
        });
    }
});

router.get('/posts', async (req, res) => {
    try {
        res.json(await post.getMultiple(false, req.query.pageSize, req.query.page));
    } catch (err) {
        logger.error(`Error while getting posts `, err);
        res.status(400).send({
            error: "Error while getting posts"
        });
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        res.json(await post.getUnique(req.params.id));
    } catch (err) {
        logger.error(`Error while getting post `, err);
        res.status(400).send({
            error: "Error while getting post"
        });
    }
});

module.exports = router;