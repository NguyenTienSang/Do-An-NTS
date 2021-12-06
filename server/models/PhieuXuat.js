const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PhieuXuatSchema = new Schema({
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
    ctpx: [
       {
        mavt: {
            type: String,
            ref: 'vattu'
        },
        giaxuat: {
            type: Number,
            require: true,
        },
        soluong: {
            type: Number,
            require: true,
        }
       }
    ]
})

module.exports = mongoose.model('phieuxuat',PhieuXuatSchema);