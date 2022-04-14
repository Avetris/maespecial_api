const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
var url = require('url');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));

const port = process.env.PORT || 3000;


app.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false
            });
        } else {
            //Use the name of the input field to retrieve the uploaded file
            let file = req.files.file;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            file.mv('./uploads/' + file.name);

            //send response
            res.send({
                status: true,
                url: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: file.name})
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);