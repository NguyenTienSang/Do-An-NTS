const VatTu = require('../models/VatTu');
const PhieuXuat = require('../models/PhieuXuat');


const exportbillCtrl = {
    getExportBill: async (req, res) => {
        try{
            const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho').populate('ctpx').populate({path :'ctpx',populate: {path: 'mavt'}});
            console.log('phieuxuat : ',phieuxuat)
            return res.json(phieuxuat)
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Lập phiếu xuất thất bại' })
        }
    },
    createExportBill: async (req, res) => {
  
        const {ngay,manv,makho,ctpx} = req.body;
        
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
    
        // console.log('tenpx : ',tenpx);
        // console.log('ngay : ',ngay);
        // console.log('manv : ',manv);
        // console.log('kho : ',makho);
        console.log('ctpx : ',ctpx);
        try {
            // const phieuxuat = await PhieuXuat.findOne({ tenpx })
            
            // if (phieuxuat)
            // {
            //     return res
            //     .status(400)
            //     .json({ success: false, message: 'Tên phiếu xuất đã tồn tại' })
            // }
            console.log('ctpx : ',ngay)
            console.log('ctpx : ',manv)
            console.log('ctpx : ',makho)
            console.log('ctpx : ',ctpx)
            const newPhieuXuat = new PhieuXuat({ngay,manv,makho,ctpx})
            console.log('test')
            console.log('test2',newPhieuXuat)
            await newPhieuXuat.save();

          
            ctpx.map(async ctpxitem => {
                const soluongvt = await VatTu.findById((ctpxitem.mavt).toString(),{"soluong": 1,"_id": 0})
               
                await VatTu.findOneAndUpdate({ _id: (ctpxitem.mavt).toString() },{soluong: soluongvt.soluong - ctpxitem.soluong}, {new:true});
            })

            return res.json({
                message: 'Đã thêm thành công'
            })
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }
  };

  module.exports = exportbillCtrl;