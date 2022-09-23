const fs = require('fs');


let filename = `gameSettings.json`;
let folder = `../game`;
let path = `${folder}/${filename}`;

function uploadGameSettings(file_text)
{
    fs.mkdir(folder, { recursive: true }, (err) => { if (err) throw err; });

    //Use the name of the input field to retrieve the uploaded file
    fs.writeFile(path, file_text, (err) => { if (err) throw err; });

    if (process.env.NODE_ENV == 'production') {
        return `./game/${filename}`;
    } else {
        return `http://localhost:${process.env.PORT}/game/${filename}`;
    }
}

function getGameSettings(lastSync)
{
    const stats = fs.statSync(path);

    console.log(new Date(stats.mtime).toUTCString())
    if(stats.mtime > lastSync)
    {
        return JSON.parse(fs.readFileSync(path, {encoding:'utf8', flag:'r'}));
    }
}

module.exports = {
    uploadGameSettings,
    getGameSettings
}
