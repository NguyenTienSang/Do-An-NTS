const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PhieuNhapSchema = new Schema({
    tenpn:{
        type: String,
        unique: true,
        required: true,
    },
    ngay:{
        type: Date,
        required: true,
    },
    manv:{
        type: Schema.Types.ObjectId,
        ref: 'nhanvien'
    },
    makho:{
        type: Schema.Types.ObjectId,
        ref: 'kho'
    },
    ctpn: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('phieunhap',PhieuNhapSchema);