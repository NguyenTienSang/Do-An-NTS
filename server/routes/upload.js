const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

//We will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// auth, authAdmin,
//Upload ảnh (chỉ admin mới có thể upload ảnh use auth, authAdmin)
router.post("/upload",(req, res) => {
  try {
    console.log(req.files);
    
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "Không có file được upload" });

    const file = req.files.file;

    // console.log('hi file : ',file);

    if (file.size > 1024 * 1024) {//Kích thước file
      //1024 * 1024 = 1mb
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large" });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {//Dạng file ảnh
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Định dạng file không đúng" });
    }

    //Upload ảnh lên cloudinary
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "material" },
      async (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);
        //After upload will have file tmp
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );

    // res.json('test upload')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
// auth, authAdmin,
// Xóa ảnh (Chỉ có admin mới có thể xóa)
router.post("/destroy", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "Bạn chưa chọn ảnh" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Đã xóa ảnh" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//Xóa file tạm
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
module.exports = router;
