const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const KhoSchema = new Schema({
  tenkho: {
    type: String,
    required: true,
  },
  madaily: {
    type: Schema.Types.ObjectId,
    ref: "daily",
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

module.exports = mongoose.model("kho", KhoSchema);
