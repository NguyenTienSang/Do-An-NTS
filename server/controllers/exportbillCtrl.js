const VatTu = require('../models/VatTu');
const PhieuXuat = require('../models/PhieuXuat');


const exportbillCtrl = {
    getExportBill: async (req, res) => {
        try{
            const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho').populate('ctpx').populate({path :'ctpx',populate: {path: 'mavt'}});
            res.json(phieuxuat)
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Lập phiếu xuất thất bại' })
        }
    },
    createExportBill: async (req, res) => {
  
        const {tenpx,ngay,manv,makho,ctpx} = req.body;
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
        if(!ctpx)
        {
            return res.status(400)
            .json({success: false,message:"Phiếu xuất chưa có vật tư"})
        }
    
        console.log('tenpx : ',tenpx);
        console.log('ngay : ',ngay);
        console.log('manv : ',manv);
        console.log('kho : ',makho);
        console.log('ctpx : ',ctpx);
        try {
            const phieuxuat = await PhieuXuat.findOne({ tenpx })
            
            if (phieuxuat)
            {
                return res
                .status(400)
                .json({ success: false, message: 'Tên phiếu xuất đã tồn tại' })
            }
            const newPhieuXuat = new PhieuXuat({tenpx,ngay,manv,makho,ctpx})
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

  module.exports = exportbillCtrl;