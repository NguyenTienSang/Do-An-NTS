const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DaiLySchema = Schema({
  tendl: {
    type: String,
    unique: true,
    required: true,
  },
  diachi: {
    type: String,
    required: true,
  },
  sodienthoai: {
    type: String,
    required: true,
  },
  trangthai: {
    type: String,
    required: true,
  },
  images: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("daily", DaiLySchema);
