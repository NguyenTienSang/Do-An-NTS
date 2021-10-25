const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CTPhieuXuatSchema = new Schema({
    mapx:{
        type: Schema.Types.ObjectId,
        ref: 'phieuxuat'
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

module.exports = mongoose.model('ctphieuxuat',CTPhieuXuatSchema);