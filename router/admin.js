var express = require('express');
var router = express.Router();

const post = require('../services/data_manager/post');
const resources = require('../services/data_manager/resource');

const logger = require('../logger')

// Authentication and Authorization Middleware
var auth = function (req, res, next)
{
    if (req.session && req.session.user === process.env.USERNAME && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};


router.post('/login', function (req, res)
{
    if (!req.body.username || !req.body.password) {
        res.sendStatus(401);
    } else if (req.body.username === process.env.USERNAME && req.body.password === process.env.PASSWORD) {
        req.session.user = process.env.USERNAME;
        req.session.admin = true;
        res.send("login success!");
    } else {
        res.sendStatus(401);
    }
});

// Logout endpoint
router.get('/logout', function (req, res)
{
    req.session.destroy();
    res.send("logout success!");
});

router.get('/check-auth', auth, function (req, res)
{
    res.send({ status: true });
});

router.get('/resources', auth, async (req, res) =>
{
    try {
        res.json(await resources.getAll());
    } catch (err) {
        logger.error(`Error while getting all resources `, err);
        res.status(400).send({
            error: "Error while getting all resources"
        });
    }
});

router.post('/resources', auth, async (req, res) =>
{
    try {
        res.json(await resources.create(req.body));
    } catch (err) {
        logger.error(`Error while creating resources `, err);
        res.status(400).send({
            error: "Error while creating resource"
        });
    }
});

router.put('/resources', auth, async (req, res) =>
{
    try {
        res.json(await resources.update(req.body));
    } catch (err) {
        logger.error(`Error while updating resources ${req.body.id}`, err);
        res.status(400).send({
            error: "Error while removing resource"
        });
    }
});

router.delete('/resources/:id', auth, async (req, res) =>
{
    try {
        res.json(await resources.remove(req.params.id));
    } catch (err) {
        logger.error(`Error while removing resource ${req.params.id}`, err);
        res.status(400).send({
            error: "Error while removing resource"
        });
    }
});


router.post('/resources_image', auth, async (req, res) =>
{
    try {
        res.json(await resources.createImage(req.body));
    } catch (err) {
        logger.error(`Error while creating resources image `, err);
        res.status(400).send({
            error: "Error while creating resources image"
        });
    }
});

router.delete('/resources_image', auth, async (req, res) =>
{
    try {
        res.json(await resources.removeImage(req.body.resource_id, req.body.image_id));
    } catch (err) {
        logger.error(`Error while removing resource ${req.body.resource_id} image ${req.body.image_id}`, err);
        res.status(400).send({
            error: "Error while removing resources image"
        });
    }
});

router.get('/posts', async (req, res) => {
    try {
        res.json(await post.getMultiple(true, req.query.pageSize, req.query.page));
    } catch (err) {
        logger.error(`Error while getting posts `, err);
        res.status(400).send({
            error: "Error while getting posts"
        });
    }
});

router.post('/post', auth, async (req, res) =>
{
    try {
        res.json(await post.create(req.body));
    } catch (err) {
        logger.error(`Error while creating post ${req.body.id}`, err);
        res.status(400).send({
            error: "Error while creating post"
        });
    }
});

router.put('/post', auth, async (req, res) =>
{
    try {
        res.json(await post.update(req.body));
    } catch (err) {
        logger.error(`Error while updating post ${req.body.id}`, err);
        res.status(400).send({
            error: "Error while updating post"
        });
    }
});

router.delete('/post/:id', auth, async (req, res) =>
{
    try {
        res.json(await post.remove(req.params.id));
    } catch (err) {
        logger.error(`Error while removing post ${req.params.id}`, err);
        res.status(400).send({
            error: "Error while removing post"
        });
    }
});

module.exports = router;