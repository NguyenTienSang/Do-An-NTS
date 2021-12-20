const VatTu = require("../models/VatTu");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");

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
    try {
      const vattu = await VatTu.find({ _id: req.params.id });
      res.json({ success: true, vattu });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getMaterialStore: async (req, res) => {
    try {
      const vattu = await VatTu.find({ _id: req.params.id });
      res.json({ success: true, vattu });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  createMaterial: async (req, res) => {
    try {
      const { tenvt, soluong, gianhap, giaxuat, donvi, trangthai, images } =
        req.body;
      console.log("tenvt : ", tenvt);
      if (!tenvt) {
        return res.status(400).json({ message: "Tên vật tư không được trống" });
      }

      if (!gianhap) {
        return res.status(400).json({ message: "Giá nhập không được trống" });
      }
      if (!giaxuat) {
        return res.status(400).json({ message: "Giá xuất không được trống" });
      }
      if (!donvi) {
        return res.status(400).json({ message: "Đơn vị không được trống" });
      }
      if (!trangthai) {
        return res.status(400).json({ message: "Trạng thái không được trống" });
      }
      if (!images) {
        return res.status(400).json({ message: "Ảnh không được trống" });
      }

      const vattu = await VatTu.findOne({ tenvt });

      if (vattu)
        return res.status(400).json({ message: "Tên vật tư đã tồn tại" });

      const newVatTu = new VatTu({
        tenvt,
        soluong,
        gianhap,
        giaxuat,
        donvi,
        trangthai,
        images,
      });
      await newVatTu.save();

      res.json({
        message: "Đã thêm thành công",
        vattu: newVatTu,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Thêm thất bại" });
    }
  },

  deleteMaterial: async (req, res) => {
    try {
      //Nếu có vật tư cần xóa trong phiếu nhập
      const phieunhap = await PhieuNhap.find().populate({
        path: "ctpn",
        populate: { path: "mavt" },
      });
      phieunhap.map((pn) => {
        pn.ctpn.find((ctpn) => {
          if (ctpn.mavt._id.toString() === req.params.id) {
            return res.status(500).json({
              message: "Vật tư đã có trong chi tiết phiếu nhập, không thể xóa",
            });
          }
        });
      });

      //Nếu có vật tư cần xóa trong phiếu xuất
      const phieuxuat = await PhieuXuat.find().populate({
        path: "ctpx",
        populate: { path: "mavt" },
      });
      // console.log("Test");
      phieuxuat.map((px) => {
        console.log("pn.ctpn : ", px.ctpx);
        px.ctpx.find((ctpx) => {
          console.log("ctpx : ", ctpx.mavt._id);
          console.log("req.params.id : ", req.params.id);
          console.log("typeof(ctpx.mavt._id) : ", typeof ctpx.mavt._id);
          console.log("typeof(req.params.id) : ", typeof req.params.id);
          if (ctpx.mavt._id.toString() === req.params.id) {
            console.log("Không được xóa");
            return res.status(500).json({
              message: "Vật tư đã có trong chi tiết phiếu xuất, không thể xóa",
            });
          }
        });
      });

      // console.log("Test");
      //Không nằm trong 2 trường hợp kia thì cho xóa
      await VatTu.findByIdAndDelete(req.params.id);
      return res.json({ message: "Xóa vật tư thành công" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateMaterial: async (req, res) => {
    try {
      const { tenvt, soluong, gianhap, giaxuat, donvi, trangthai, images } =
        req.body;

      if (!tenvt) {
        return res
          .status(400)
          .json({ success: false, message: "Tên vật tư không được trống" });
      }
      // if (!soluong) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Số lượng không được trống" });
      // }
      if (!gianhap) {
        return res
          .status(400)
          .json({ success: false, message: "Giá nhập không được trống" });
      }
      if (!giaxuat) {
        return res
          .status(400)
          .json({ success: false, message: "Giá xuất không được trống" });
      }
      if (!donvi) {
        return res
          .status(400)
          .json({ success: false, message: "Đơn vị không được trống" });
      }
      if (!trangthai) {
        return res.status(400).json({ message: "Trạng thái không được trống" });
      }
      if (!images) {
        return res
          .status(400)
          .json({ success: false, message: "Ảnh không được trống" });
      }

      if (trangthai === "Ngừng kinh doanh" && soluong > 0) {
        return res.status(401).json({
          success: false,
          message: "Vật tư còn tồn kho, vui lòng xuất hết vật tư",
        });
      }

      updatedVatTu = await VatTu.findOneAndUpdate(
        { _id: req.params.id },
        { tenvt, soluong, gianhap, giaxuat, donvi, trangthai, images },
        { new: true }
      );

      // User not authorised to update vattu
      if (!updatedVatTu)
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy vật tư cần cập nhật",
        });

      res.json({
        success: true,
        message: "Cập nhật vật tư thành công",
        vattu: updatedVatTu,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Cập nhật vật tư thất bại" });
    }
  },
};

module.exports = materialCtrl;
