var express = require('express');

var router = express.Router();

const post = require('../services/data_manager/post');

router.get('/', function(req, res, next) {
    res.send('Express RESTful API');
});


router.get('/post', async (req, res) => {
    try {
        res.json(await post.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting post `, err.message);
    }
});

module.exports = router;