const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
   
    try {

        const token = req.header("Authorization");
        if(!token)
        return res
        .status(400)
        .json({ success: false, message: 'Token truy cập không tìm thấy'})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, nhanvien) => {
            if(err) return res.status(400).json({message: "Invalid Authentication"})

            req.nhanvien = nhanvien;
            next()
        })
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: err.message})
    }
}

module.exports = auth;