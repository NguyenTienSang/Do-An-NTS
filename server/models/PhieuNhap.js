const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PhieuNhapSchema = new Schema({
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
    ctpn: [
        {
            mavt: {
                type: String,
                ref: 'vattu'
            },
            gianhap: {
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

module.exports = mongoose.model('phieunhap',PhieuNhapSchema);