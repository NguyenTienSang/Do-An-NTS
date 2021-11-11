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
},{
    timestamps: true
})

module.exports = mongoose.model('phieunhap',PhieuNhapSchema);