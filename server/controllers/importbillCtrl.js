const VatTu = require('../models/VatTu');
const PhieuNhap = require('../models/PhieuNhap');


const importbillCtrl = {
    getImportBill: async (req, res) => {
        try{
            const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho').populate('ctpn').populate({path :'ctpn',populate: {path: 'mavt'}});
            res.json(phieunhap)
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Lập phiếu nhập thất bại' })
        }
    },
    createImportBill: async (req, res) => {
  
        const {tenpn,ngay,manv,makho,ctpn} = req.body;
        console.log('tenpn1 : ',tenpn);
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
        console.log('ctpn : ',ctpn[0]);
        if(!ctpn)
        {
            return res.status(400)
            .json({success: false,message:"Phiếu nhập chưa có vật tư"})
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
            const newPhieuNhap = new PhieuNhap({tenpn,ngay,manv,makho,ctpn})
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

    }
    ,
    addImportBill: async (req, res) => {
        try {
          const pn = await PhieuNhap.findById(req.params.id);
          if (!pn)
            return res.status(400).json({ msg: "Phiếu nhập không tồn tại" });
    
          await PhieuNhap.findOneAndUpdate(
            { _id: req.params.id },
            {
                ctpn: req.body.ctpn,
            }
          );
          return res.json({ msg: "Đã thêm vào phiếu nhập" });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
  };

  module.exports = importbillCtrl;