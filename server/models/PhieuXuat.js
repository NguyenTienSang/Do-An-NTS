const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PhieuXuatSchema = new Schema({
    tenpx:{
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
})

module.exports = mongoose.model('phieuxuat',PhieuXuatSchema);