const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const PhieuNhap = require('../models/PhieuNhap');

// @route GET api/kho
// @desc Get Kho
// @access  
router.get('/', verifyToken, async(req,res) =>{
    try{
        const phieunhap = await PhieuNhap.find().populate('manv').populate('makho');
        res.json({success: true, phieunhap})
    } catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// @route POST api/vatu
// @desc Create Vatut
// @access  
router.post('/', verifyToken, async (req, res) => {
    const {tenpn,ngay,manv,makho} = req.body;
    if(!tenpn)
    {
        return res.status(400)
        .json({success: false,message:"Tên phiếu nhập không được trống"})
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

    console.log('tenpn : ',tenpn);
    console.log('ngay : ',ngay);
    console.log('manv : ',manv);
    console.log('kho : ',makho);
    try {
        const phieunhap = await PhieuNhap.findOne({ tenpn })
        
		if (phieunhap)
        {
            return res
            .status(400)
            .json({ success: false, message: 'Tên phiếu nhập đã tồn tại' })
        }
        const newPhieuNhap = new PhieuNhap({tenpn,ngay,manv,makho})
        await newPhieuNhap.save();
        res.json({
			success: true,
			message: 'Đã thêm thành công',
			phieunhap: newPhieuNhap
		})

    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Lập phiếu nhập thất bại' })
    }
})

module.exports = router;