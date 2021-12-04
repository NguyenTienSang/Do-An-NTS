const NhanVien = require('../models/NhanVien');

const authAdmin = async(req, res, next) => {
    try {
        //Get user information by id
        const nhanvien = await NhanVien.findOne({
            _id: req.nhanvien.id
        })
        if(nhanvien.role === 'user')
            return res.status(400).json({message: "Bạn không thuộc quyền Admin"})

            next()
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports = authAdmin