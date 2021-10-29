const VatTu = require('../models/VatTu');
const PhieuXuat = require('../models/PhieuXuat');


const importbillCtrl = {
    getExportBill: async (req, res) => {
        try{
            const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho');
            res.json(phieuxuat)
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Lập phiếu xuất thất bại' })
        }
    },
    createExportBill: async (req, res) => {
  
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
    
        console.log('tenpx : ',tenpx);
        console.log('ngay : ',ngay);
        console.log('manv : ',manv);
        console.log('kho : ',makho);
        try {
            const phieuxuat = await PhieuXuat.findOne({ tenpx })
            
            if (phieuxuat)
            {
                return res
                .status(400)
                .json({ success: false, message: 'Tên phiếu nhập đã tồn tại' })
            }
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

    }
  };

  module.exports = importbillCtrl;