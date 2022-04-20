var express = require('express');
var router = express.Router();

const post = require('../services/data_manager/post');
const resources = require('../services/data_manager/resource');

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.user === process.env.USERNAME && req.session.admin)
      return next();
    else
      return res.sendStatus(401);
};


router.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.sendStatus(401);
    } else if(req.body.username === process.env.USERNAME && req.body.password === process.env.PASSWORD) {
      req.session.user = process.env.USERNAME;
      req.session.admin = true;
      res.send("login success!");
    }else{
        res.sendStatus(401);
    }
});

// Logout endpoint
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

router.get('/check-auth', auth, function (req, res) {    
    res.send({status: true});
});

router.get('/resources', auth, async (req, res) => {
    try {
        res.json(await resources.getAll());
    } catch (err) {
        console.error(`Error while getting all resources `, err.message);
    }
});

router.post('/resources', auth, async (req, res) => {
    try {
        res.json(await resources.create(req.body));
    } catch (err) {
        console.error(`Error while creating resources `, err.message);
    }
});

router.put('/resources/:id', auth, async (req, res) => {
    try {
        res.json(await resources.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while getting resources `, err.message);
    }
});


router.delete('/resources/:id', auth, async (req, res) => {
    try {
        res.json(await resources.remove(req.params.id));
    } catch (err) {
        console.error(`Error while getting resources `, err.message);
    }
});

router.post('/create-post', auth, async (req, res) => {    
    res.send('Express RESTful API');
});

router.post('/upload', auth, async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false
            });
        } else {
            //Use the name of the input field to retrieve the uploaded file
            let file = req.files.file;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            file.mv('../blog_images/' + file.name);
            //send response
            res.send({
                status: true,
                url: `./data/${file.name}`
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;