const express = require('express');
const router = express.Router();
const cloudinary = require('../cloud/cloudinary');
const upload = require('../cloud/multer')
const fs = require('fs');

router.post('/upload-images', upload.array('image'), async(req, res) => {
  const uploader = async(path) => await cloudinary.uploads(path, 'Image');
  const urls = []
  const files = req.files

  for(const file of files) {
    const {path} = file
    const newPath = await uploader(path)
    urls.push(newPath);
    console.log(newPath);
    fs.unlinkSync(path);    
  }
  res.send({
      message : 'image uploaded!',
      data  :urls
  })
})


module.exports = router;