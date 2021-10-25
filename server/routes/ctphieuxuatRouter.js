const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const CTPhieuXuat = require('../models/CTPhieuXuat');


// @route GET api/ctpx
// @desc Get Kho
// @access  
router.get('/', verifyToken, async(req,res) =>{
    try{
        const ctphieuxuat = await CTPhieuXuat.find().populate('mapx').populate({path :'mapx',populate: {path: 'manv'}}).populate({path:'mapx',populate: {path: 'makho'}}).populate('mavt');
        res.json({success: true, ctphieuxuat})
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
        const ctphieuxuat = await CTPhieuXuat.find({mapx:req.params.id}).populate('mapx').populate('mavt');
        res.json({success: true, ctphieuxuat})
    } catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// @route POST api/vatu
// @desc Create Vatut
// @access  
router.post('/', verifyToken, async (req, res) => {
    const {mapx,mavt,soluong} = req.body;
    if(!mapx)
    {
        return res.status(400)
        .json({success: false,message:"Mã phiếu xuất không được trống"})
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
        const newCTPhieuXuat = new CTPhieuXuat({mapx,mavt,soluong})
        await newCTPhieuXuat.save();

        res.json({
			success: true,
			message: 'Đã thêm thành công',
			ctphieuxuat: newCTPhieuXuat
		})

    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router;