const NhanVien = require("../models/NhanVien");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");
const DaiLy = require("../models/DaiLy");
const Kho = require("../models/Kho");

const storeCtrl = {
  getALLStore: async (req, res) => {
    try {
      //   const employees = await NhanVien.find().populate('madaily').sort({madaily: 1,hoten: 1});
      // const daily = await DaiLy.find().sort({tendl: 1});
      const dailys = await DaiLy.find();
      res.json(dailys);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getStore: async (req, res) => {
    try {
      const daily = await DaiLy.find({ _id: req.params.id });
      res.json({ success: true, daily });
    } catch (error) {
      return res.status(500).json({ message: err.message });
    }
  },

  createStore: async (req, res) => {
    try {
      const { tendl, diachi, sodienthoai, trangthai, images } = req.body;
      console.log("data input : ", req.body);
      if (!tendl) {
        return res
          .status(400)
          .json({ success: false, message: "Tên đại lý không được trống" });
      }
      if (!diachi) {
        return res
          .status(400)
          .json({ success: false, message: "Địa chỉ không được trống" });
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

      if (!images.public_id) {
        return res
          .status(400)
          .json({ success: false, message: "Ảnh không được trống" });
      }

      console.log("test");

      const daily = await DaiLy.findOne({ tendl });

      if (daily) {
        console.log("Đại lý đã tồn tại");
        return res.status(400).json({ message: "Tên đại lý đã tồn tại" });
      }
      const newDaiLy = new DaiLy({
        tendl,
        diachi,
        sodienthoai,
        trangthai,
        images,
      });
      await newDaiLy.save();

      res.json({
        message: "Đã thêm thành công",
        daily: newDaiLy,
      });
    } catch (err) {
      // console.log(err)
      return res.status(500).json({ message: err.message });
    }
  },

  deleteStore: async (req, res) => {
    console.log("req.params.id : ", req.params.id);
    try {
      const ktnhanvien = await NhanVien.findOne({ madaily: req.params.id });

      if (ktnhanvien) {
        return res
          .status(401)
          .json({ message: "Đại lý đã có nhân viên. Không thể xóa !" });
      }

      const ktkho = await Kho.findOne({ madaily: req.params.id });
      if (ktkho) {
        return res
          .status(401)
          .json({ message: "Đại lý đã có kho. Không thể xóa !" });
      }

      if (!ktnhanvien > 0 && !ktkho > 0) {
        const deleteDaiLy = await DaiLy.findOneAndDelete({
          _id: req.params.id,
        });
        if (!deleteDaiLy) {
          return res.status(401).json({ message: "Đại lý không tìm thấy" });
        } else {
          res.json({ message: "Xóa thành công", daily: deleteDaiLy });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Xóa thất bại" });
    }
  },

  updateStore: async (req, res) => {
    try {
      const { tendl, diachi, sodienthoai, trangthai, images } = req.body;

      if (!tendl) {
        return res.status(400).json({ message: "Tên đại lý không được trống" });
      }
      if (!diachi) {
        return res.status(400).json({ message: "Địa chỉ không được trống" });
      }
      if (!sodienthoai) {
        return res
          .status(400)
          .json({ message: "Số điện thoại không được trống" });
      }
      if (!trangthai) {
        return res.status(400).json({ message: "Trạng thái không được trống" });
      }
      if (!images) {
        return res.status(400).json({ message: "Ảnh không được trống" });
      }

      // const daily = await DaiLy.findOne({ tendl });
      console.log("req.params.id : ", req.params.id);
      const daily = await DaiLy.findById(req.params.id);

      const kttendl = await DaiLy.findOne({ tendl });

      if (kttendl && tendl !== daily.tendl) {
        return res
          .status(400)
          .json({ success: false, message: "Tên kho đã tồn tại" });
      }

      const ktsodienthoai = await DaiLy.findOne({ sodienthoai });
      if (ktsodienthoai && sodienthoai !== daily.sodienthoai) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại đã tồn tại" });
      }

      if (trangthai === "Ngừng hoạt động") {
        const ktnhanvien = await NhanVien.findOne({ madaily: req.params.id });

        if (ktnhanvien) {
          return res
            .status(401)
            .json({
              message: "Đại lý đang có nhân viên. Không thể ngừng hoạt động !",
            });
        }

        const ktkho = await Kho.findOne({ madaily: req.params.id });
        if (ktkho) {
          return res
            .status(401)
            .json({
              message: "Đại lý đang có kho. Không thể ngừng hoạt động !",
            });
        }
      }

      let updatedDaiLy = { tendl, diachi, sodienthoai, trangthai, images };

      updatedDaiLy = await DaiLy.findOneAndUpdate(
        { _id: req.params.id },
        updatedDaiLy,
        { new: true }
      );

      // User not authorised to update vattu
      if (!updatedDaiLy)
        return res.status(401).json({
          message: "Đại lý không tìm thấy hoặc user không được quyền",
        });

      return res.json({
        message: "Cập nhật thành công",
        daily: updatedDaiLy,
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi cập nhật" });
    }
  },
};

module.exports = storeCtrl;
