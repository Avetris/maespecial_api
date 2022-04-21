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
        logger.error(`Error while getting all resources `, err.message);
    }
});

router.post('/resources', auth, async (req, res) =>
{
    try {
        res.json(await resources.create(req.body));
    } catch (err) {
        logger.error(`Error while creating resources `, err.message);
    }
});

router.put('/resources', auth, async (req, res) =>
{
    try {
        res.json(await resources.update(req.body));
    } catch (err) {
        logger.error(`Error while updating resources ${req.body.id}`, err.message);
    }
});


router.delete('/resources/:id', auth, async (req, res) =>
{
    try {
        res.json(await resources.remove(req.params.id));
    } catch (err) {
        logger.error(`Error while removing resource ${req.params.id}`, err.message);
    }
});

router.post('/post', auth, async (req, res) =>
{
    try {
        res.json(await post.create(req.body));
    } catch (err) {
        logger.error(`Error while creating post ${req.body.id}`, err.message);
    }
});

router.put('/post', auth, async (req, res) =>
{
    try {
        res.json(await post.update(req.body));
    } catch (err) {
        logger.error(`Error while updating post ${req.body.id}`, err.message);
    }
});

router.delete('/post/:id', auth, async (req, res) =>
{
    try {
        res.json(await post.remove(req.params.id));
    } catch (err) {
        logger.error(`Error while removing post ${req.params.id}`, err.message);
        logger.error(err.message);
    }
});

module.exports = router;