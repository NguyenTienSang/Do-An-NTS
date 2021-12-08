const Kho = require("../models/Kho");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");

const warehouseCtrl = {
  getAllWareHouse: async (req, res) => {
    try {
      const kho = await Kho.find().populate("madaily");
      res.json(kho);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  createWareHouse: async (req, res) => {
    try {
      const { tenkho, madaily, diachi, sodienthoai, trangthai, images } =
        req.body;

      if (!tenkho) {
        return res.status(400).json({ message: "Tên kho không được trống" });
      }
      if (!madaily) {
        console.log("ID DAI LY : ");
        return res.status(400).json({ message: "Mã đại lý không được trống" });
      }
      if (!diachi) {
        return res.status(400).json({ message: "Địa chỉ không được trống" });
      }

      if (!sodienthoai) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại không được trống" });
      }

      if (sodienthoai.length != 10) {
        return res
          .status(400)
          .json({ message: "Số điện thoại phải đúng 10 số" });
      }

      if (!trangthai) {
        return res.status(400).json({ message: "Trạng thái không được trống" });
      }

      if (!images) {
        return res.status(400).json({ message: "Ảnh trống" });
      }

      console.log("new kho : ", req.body);

      const kho = await Kho.findOne({ tenkho });

      if (kho) {
        return res
          .status(400)
          .json({ success: false, message: "Tên kho đã tồn tại" });
      }

      const newKho = new Kho({
        tenkho,
        madaily,
        diachi,
        sodienthoai,
        trangthai,
        images,
      });
      await newKho.save();

      res.json({
        message: "Đã thêm thành công",
        kho: newKho,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  },

  updateWareHouse: async (req, res) => {
    try {
      const {
        tenkho,
        madaily,
        diachi,
        sodienthoai,
        trangthai,
        images,
        tenkhocheck,
      } = req.body;

      if (!tenkho) {
        return res.status(400).json({ message: "Tên kho không được trống" });
      }
      if (!madaily) {
        return res.status(400).json({ message: "Mã đại lý không được trống" });
      }
      if (!diachi) {
        return res.status(400).json({ message: "Địa chỉ không được trống" });
      }

      if (!sodienthoai) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại không được trống" });
      }

      if (sodienthoai.length != 10) {
        return res
          .status(400)
          .json({ message: "Số điện thoại phải đúng 10 số" });
      }
      if (!trangthai) {
        return res.status(400).json({ message: "Trạng thái không được trống" });
      }
      if (!images) {
        return res.status(400).json({ message: "Ảnh trống" });
      }

      console.log("new kho : ", req.body);

      const kho = await Kho.findOne({ tenkho });

      if (kho && kho.tenkho !== tenkhocheck) {
        return res
          .status(400)
          .json({ success: false, message: "Tên kho đã tồn tại" });
      }

      let updateKho = {
        tenkho,
        madaily,
        diachi,
        sodienthoai,
        trangthai,
        images,
      };
      console.log("Thông tin kho update : ", updateKho);
      updateKho = await Kho.findOneAndUpdate(
        { _id: req.params.id },
        updateKho,
        { new: true }
      );

      // User not authorised to update vattu
      if (!updateKho)
        return res.status(401).json({ message: "Kho không tìm thấy" });

      res.json({
        message: "Cập nhật thành công",
        kho: updateKho,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteWareHouse: async (req, res) => {
    try {
      console.log("Test");

      //Kiểm tra kho này đã có phiếu nhập chưa
      const ktpn = await PhieuNhap.findOne({ makho: req.params.id });
      if (ktpn) {
        return res
          .status(401)
          .json({ message: "Kho đã có phiếu nhập. Không thể xóa !" });
      }
      //Kiểm tra kho này đã có phiếu xuất chưa
      const ktpx = await PhieuXuat.findOne({ makho: req.params.id });
      if (ktpx) {
        return res
          .status(401)
          .json({ message: "Kho đã có phiếu xuất. Không thể xóa !" });
      }
      if (!ktpn > 0 && !ktpx > 0) {
        const deleteKho = await Kho.findOneAndDelete({ _id: req.params.id });
        console.log("Đã xóa kho : ", deleteKho);
        if (!deleteKho) {
          return res
            .status(401)
            .json({ message: "Không tìm thấy kho cần xóa" });
        } else {
          return res.json({ message: "Xóa kho thành công" });
        }
      }
    } catch (error) {
      // console.log(error)
      res.status(500).json({ message: "Xóa kho thất bại" });
    }
  },
};

module.exports = warehouseCtrl;
