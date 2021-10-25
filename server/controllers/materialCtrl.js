const VatTu = require('../models/VatTu');
const CTPhieuNhap = require('../models/CTPhieuNhap');
const CTPhieuXuat = require('../models/CTPhieuXuat');


const materialCtrl = {
    getALLMaterial: async (req, res) => {
      try {
        const materials = await VatTu.find();
        res.json(materials);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    },
    getMaterial: async (req, res) => {
        try{
            const vattu = await VatTu.find({_id:req.params.id});
            res.json({success: true,vattu})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Internal server error' })
        }
      },
    createMaterial: async (req, res) => {
  
      try {
        const {tenvt,soluong,gianhap,giaxuat,donvi,images} = req.body;
      if(!tenvt)
      {
          return res.status(400)
          .json({message:"Tên vật tư không được trống"})
      }
     
      if(!gianhap)
      {
          return res.status(400)
          .json({message:"Giá nhập không được trống"})
      }
      if(!giaxuat)
      {
          return res.status(400)
          .json({message:"Giá xuất không được trống"})
      }
      if(!donvi)
      {
          return res.status(400)
          .json({message:"Đơn vị không được trống"})
      }
      if(!images)
      {
          return res.status(400)
          .json({message:"Ảnh không được trống"})
      }

          const vattu = await VatTu.findOne({ tenvt })
  
          if (vattu)
              return res
                  .status(400)
                  .json({message: 'Tên vật tư đã tồn tại' })
                
  
          const newVatTu = new VatTu({tenvt,soluong,gianhap,giaxuat,donvi,images})
          await newVatTu.save();
  
          res.json({
              message: 'Đã thêm thành công',
              vattu: newVatTu
          })
  
      } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'Thêm thất bại' })
      }

    },

    deleteMaterial: async (req, res) => {
      try {
        await VatTu.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa vật tư thành công" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    },

    updateMaterial: async (req, res) => {
    try {
        const {tenvt,soluong,gianhap,giaxuat,donvi,images} = req.body;
 
        if(!tenvt)
        {
            return res.status(400)
            .json({success: false,message:"Tên vật tư không được trống"})
        }
        if(!soluong)
        {
            return res.status(400)
            .json({success: false,message:"Số lượng không được trống"})
        }
        if(!gianhap)
        {
            return res.status(400)
            .json({success: false,message:"Giá nhập không được trống"})
        }
        if(!giaxuat)
        {
            return res.status(400)
            .json({success: false,message:"Giá xuất không được trống"})
        }
        if(!donvi)
        {
            return res.status(400)
            .json({success: false,message:"Đơn vị không được trống"})
        }
        if(!images)
        {
            return res.status(400)
            .json({success: false,message:"Ảnh không được trống"})
        }

        updatedVatTu = await VatTu.findOneAndUpdate({_id:req.params.id},{tenvt,soluong,gianhap,giaxuat,donvi,images}, {new:true});
       
        // User not authorised to update vattu
        if(!updatedVatTu)
        return res.status(401).json({success: false, message:'Không tìm thấy vật tư cần cập nhật'})
    
        res.json({success: true, message: "Cập nhật vật tư thành công",vattu: updatedVatTu})
    } catch (error) {
        console.log(error)
		res.status(500).json({message: 'Cập nhật vật tư thất bại' })
    }

      try {
        const { title, price, description, content, images, category } = req.body;
        if (!images) return res.status(400).json({ message: "No image upload" });
  
        await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            title: title.toLowerCase(),
            price,
            description,
            content,
            images,
            category,
          }
        );
  
        res.json({ message: "Updated a Product" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    },
  };

  module.exports = materialCtrl;