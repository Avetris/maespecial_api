const fs = require('fs');

function uploadImage(file_base64, folder)
{
    let filename = `${Date.now()}.jpg`;
    let path = `../blog_images/${folder}/`
    //Use the name of the input field to retrieve the uploaded file
    decodeBase64(file_base64, path, filename);

    if (process.env.NODE_ENV == 'production') {
        return `./data/${folder}/${filename}`;
    } else {
        return `http://localhost:${process.env.PORT}/data/${folder}/${filename}`;
    }
}

function decodeBase64(file_base64, path, filename)
{
  const ext = file_base64.substring(file_base64.indexOf("/") + 1, file_base64.indexOf(";base64"));
  const fileType = file_base64.substring("data:".length, file_base64.indexOf("/"));
  //Forming regex to extract base64 data of file.
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
  //Extract base64 data.
  const base64Data = file_base64.replace(regex, "");

  fs.mkdir(path, { recursive: true }, (err) => { if (err) throw err; });

  fs.writeFileSync(path + filename, base64Data, 'base64');
}

function removeImage(location)
{    
    fs.rmSync(`../blog_images/${location}`, { recursive: true, force: true });
}

module.exports = {
    uploadImage,
    removeImage
}
