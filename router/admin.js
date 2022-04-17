var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Express RESTful API');
});
  

router.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false
            });
        } else {
            console.log('Pre file');
            //Use the name of the input field to retrieve the uploaded file
            let file = req.files.file;
            
            console.log('Pre move');
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            file.mv('../blog_images/' + file.name);

            console.log('Pre send');
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