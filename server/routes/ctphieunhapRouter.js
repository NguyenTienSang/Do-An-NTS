const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const CTPhieuNhap = require('../models/CTPhieuNhap');

// @route GET api/ctpn
// @desc Get Kho
// @access  
router.get('/', verifyToken, async(req,res) =>{
    try{
        const ctphieunhap = await CTPhieuNhap.find().populate('mapn').populate({path :'mapn',populate: {path: 'manv'}}).populate({path:'mapn',populate: {path: 'makho'}}).populate('mavt');
        res.json({success: true, ctphieunhap})
    } catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// @route GET api/kho
// @desc Get Kho
// @access  
router.get('/:id', verifyToken, async(req,res) =>{
    try{
        const ctphieunhap = await CTPhieuNhap.find({mapn:req.params.id}).populate('mapn').populate('mavt');
        res.json({success: true, ctphieunhap})
    } catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



// @route POST api/vatu
// @desc Create Vatut
// @access  
router.post('/', verifyToken, async (req, res) => {
    const {mapn,mavt,soluong} = req.body;
    if(!mapn)
    {
        return res.status(400)
        .json({success: false,message:"Mã phiếu nhập không được trống"})
    }
    if(!mavt)
    {
        return res.status(400)
        .json({success: false,message:"Mã vật tư không được trống"})
    }
    if(!soluong)
    {
        return res.status(400)
        .json({success: false,message:"Số lượng không được trống"})
    }

    try {
        const newCTPhieuNhap = new CTPhieuNhap({mapn,mavt,soluong})
        await newCTPhieuNhap.save();

        res.json({
			success: true,
			message: 'Đã thêm thành công',
			ctphieunhap: newCTPhieuNhap
		})

    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router;