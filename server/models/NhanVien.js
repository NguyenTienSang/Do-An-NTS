const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhanVienSchema = new Schema({
    hoten:{
        type: String,
        required: true,
    },
    madaily:{
        type: Schema.Types.ObjectId,
        ref: 'daily'
    },
    diachi:{
        type: String,
        required: true,
        trim:true,
    },
    username:{
        type: String,
        required: true,
        trim:true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        trim:true,
    },
    gioitinh:{
        type: String,
        required: true,
        trim:true,
    },
    role:{
        type: String,
        required: true,
        trim:true,
    },
    sodienthoai:{
        type: String,
        required: true,
    },
    cmnd:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    trangthai:{
        type: String,
        required: true,
    },
    images:{
        type: Object,
        required: true,
    }
})

module.exports = mongoose.model('nhanvien', NhanVienSchema)