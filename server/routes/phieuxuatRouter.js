const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const PhieuXuat = require('../models/PhieuXuat');

// @route GET api/kho
// @desc Get Kho
// @access  
router.get('/', verifyToken, async(req,res) =>{
    try{
        const phieuxuat = await PhieuXuat.find().populate('manv').populate('makho');
        res.json({success: true, phieuxuat})
    } catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// @route POST api/vatu
// @desc Create Vatut 
// @access  
router.post('/', verifyToken, async (req, res) => {
    const {tenpx,ngay,manv,makho} = req.body;
    if(!tenpx)
    {
        return res.status(400)
        .json({success: false,message:"Tên phiếu xuất không được trống"})
    }
    if(!ngay)
    {
        return res.status(400)
        .json({success: false,message:"Ngày không được trống"})
    }
    if(!manv)
    {
        return res.status(400)
        .json({success: false,message:"Mã nhân viên không được trống"})
    }
    if(!makho)
    {
        return res.status(400)
        .json({success: false,message:"Mã kho không được trống"})
    }

    try {
        const newPhieuXuat = new PhieuXuat({tenpx,ngay,manv,makho})
        await newPhieuXuat.save();
        res.json({
			success: true,
			message: 'Đã thêm thành công',
			phieuxuat: newPhieuXuat
		})

    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Lập phiếu xuất thất bại' })
    }
})

module.exports = router;