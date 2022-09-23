const fs = require('fs');

function uploadGameSettings(file_text)
{
    let filename = `gameSettings.json`;
    let folder = `../game`;

    fs.mkdir(folder, { recursive: true }, (err) => { if (err) throw err; });

    //Use the name of the input field to retrieve the uploaded file
    fs.writeFile(`${folder}/${filename}`, file_text, (err) => { if (err) throw err; });

    if (process.env.NODE_ENV == 'production') {
        return `./game/${filename}`;
    } else {
        return `http://localhost:${process.env.PORT}/game/${filename}`;
    }
}

module.exports = {
    uploadGameSettings
}
