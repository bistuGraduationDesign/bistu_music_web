var path = require("path");
var fs = require("fs");

function upload (req, tag, name, callback) {
  //get filename
  console.log("eq.files.file_data: "+req.files.file_data);
  console.log("eq.files.file_data000: "+req.files.file_data[0]);
    console.log("eq.files.file_data000: "+req.files.file_data[0].type);

  console.log("tag: "+tag);
  var filename = req.body.name + "." + req.files.file_data[tag].type.split("/")[1];
  //copy file to a public directory
  var targetPath = path.dirname(__filename).substring(0, path.dirname(__filename).lastIndexOf("/")) + '/public/updata/' + name + "/" + filename;
  //copy file
  // stream = fs.createWriteStream(path.join(upload_dir, name));
  const readStream = fs.createReadStream(req.files.file_data[tag].path);
  const writeStream = fs.createWriteStream(targetPath, {
    flags: 'w',
    encoding: null,
    mode: 0666
  });
  readStream.pipe(writeStream);
  readStream.on('error', (error) => {
    // console.log('readStream error', error.message);
    callback(error.message);
  })
  writeStream.on('error', (error) => {
    // console.log('writeStream error', error.message);
    callback(error.message);
  })
  readStream.on('end', function() {
    callback(null)
  })
};

exports.select = function(req, tag1, tag2, callback) {
  upload(req, tag1, 'images', function(err) {
    if (err) {
      callback(err)
    } else {
      upload(req, tag2, 'musics', function(err) {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  })
}