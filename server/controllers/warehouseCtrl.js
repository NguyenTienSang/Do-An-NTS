const Kho = require('../models/Kho');


const warehouseCtrl = {

    getAllWareHouse: async (req, res) => {
        try{
            const kho = await Kho.find().populate('madaily');
            res.json(kho)
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },


    createWareHouse: async (req, res) => {
        try {
          const {tenkho,madaily,diachi,sodienthoai,images} = req.body;
          if(!tenkho)
          {
              return res.status(400)
              .json({message:"Tên kho không được trống"})
          }
          if(!madaily)
          {
              console.log('ID DAI LY : ');
              return res.status(400)
              .json({message:"Mã đại lý không được trống"})
          }
          if(!diachi)
          {
              return res.status(400)
              .json({message:"Địa chỉ không được trống"})
          }

          if(!sodienthoai)
          {
              return res.status(400)
              .json({success: false,message:"Số điện thoại không được trống"})
          }

          if(sodienthoai.length != 10)
          {
              return res.status(400)
              .json({message:"Số điện thoại phải đúng 10 số"})
          }   

          if(!images)
          {
              return res.status(400)
              .json({message:"Ảnh trống"})
          }
            
  
          const kho = await Kho.findOne({ tenkho })
    
          if (kho)
          {
              return res
              .status(400)
              .json({ success: false, message: 'Tên kho đã tồn tại' })
          }
  
  
          const newKho = new Kho({tenkho,madaily,diachi,sodienthoai,images})
          await newKho.save();
  
          res.json({
            message: 'Đã thêm thành công',
            kho: newKho
          })
    
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: err.message });
        }
  
      },  

 
      updateWareHouse: async (req, res)  => {
        try {

            const {hoten,madaily,diachi,username,password,role,sodienthoai,cmnd,tinhtrang,images} = req.body;
            if(!hoten)
            {
                return res.status(400)
                .json({success: false,message:"Họ tên trống"})
            }
            if(!madaily)
                {
                    return res.status(400)
                    .json({success: false,message:"Mã nhân viên trống"})
                }
            if(!diachi)
            {
                return res.status(400)
                .json({success: false,message:"Địa chỉ trống"})
            }
            if(!username)
            {
                return res.status(400)
                .json({success: false,message:"Username trống"})
            }
            if(!password)
            {
                return res.status(400)
                .json({success: false,message:"Mật khẩu trống"})
            }
            if(!role)
            {
                return res.status(400)
                .json({success: false,message:"Quyền trống"})
            }
            if(!sodienthoai)
            {
                return res.status(400)
                .json({success: false,message:"Số điện thoại trống"})
            }
            if(!cmnd)
            {
                return res.status(400)
                .json({success: false,message:"CMND trống"})
            }
            if(!tinhtrang)
            {
                return res.status(400)
                .json({success: false,message:"Trình trạng trống"})
            }
            if(!images)
            {
                return res.status(400)
                .json({success: false,message:"Ảnh trống"})
            }


            let updatedNhanVien = {hoten,madaily,diachi,username,password,role,sodienthoai,cmnd,tinhtrang,images}
        
            updatedNhanVien = await NhanVien.findOneAndUpdate({_id:req.params.id},updatedNhanVien, {new:true});
        
            // User not authorised to update vattu
            if(!updatedNhanVien)
            return res.status(401).json({success: false, message:'Nhân viên không tìm thấy'})

            res.json({success: true, message: "Cập nhật thành công",nhanvien: updatedNhanVien})
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    },
    deleteWareHouse: async (req, res)  => {
        try {
            const ktpn = await PhieuNhap.findOne({manv: req.params.id});
            if(ktpn)
            {
                return res.status(401).json({message:'Nhân viên đã lập phiếu nhập. Không thể xóa !'})
            }
            const ktpx = await PhieuXuat.findOne({manv: req.params.id});
            if(ktpx)
            {
                return res.status(401).json({message:'Nhân viên đã lập phiếu xuất. Không thể xóa !'})
            }
            if(!ktpn > 0 && !ktpx > 0)
            {
                
                const deleteNhanVien = await NhanVien.findOneAndDelete({_id: req.params.id});
                if(!deleteNhanVien)
                {
                    return res.status(401).json({message:'Không tìm thấy nhân viên cần xóa'})
                }
                else {
                    return res.json({message: "Xóa nhân viên thành công"})  
                }  
            }
        } catch(error) {
            // console.log(error)
            res.status(500).json({message: 'Xóa nhân viên thất bại' })
        }
    }
  };

  module.exports = warehouseCtrl;