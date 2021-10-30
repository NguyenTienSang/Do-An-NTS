const mongoose = require('mongoose');

const VatTuSchema = new mongoose.Schema({
    tenvt:{
        type: String,
        unique: true,
        required: true,
    },
    soluong:{
        type: Number,
        required: true,
    },
    gianhap:{
        type: Number,
        required: true,
    },  
    giaxuat:{
        type: Number,
        required: true,
    },
    donvi:{
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

module.exports = mongoose.model('vattu',VatTuSchema);