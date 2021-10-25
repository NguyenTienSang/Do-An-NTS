const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CTPhieuNhapSchema = new Schema({
    mapn:{
        type: Schema.Types.ObjectId,
        ref: 'phieunhap'
    },
    mavt:{
        type: Schema.Types.ObjectId,
        ref: 'vattu'
    },
    soluong:{
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('ctphieunhap',CTPhieuNhapSchema);