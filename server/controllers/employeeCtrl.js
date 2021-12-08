const NhanVien = require("../models/NhanVien");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");

const employeeCtrl = {
  getAllEmployee: async (req, res) => {
    try {
      //   const employees = await NhanVien.find().populate('madaily').sort({madaily: 1,hoten: 1});

      const employees = await NhanVien.find().populate("madaily");
      //   console.log('nhanvienthuocdaily : ',employees);
      res.json(employees);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const {
        hoten,
        madaily,
        diachi,
        username,
        password,
        gioitinh,
        role,
        sodienthoai,
        cmnd,
        email,
        trangthai,
        images,
      } = req.body;
      if (!hoten) {
        return res
          .status(400)
          .json({ success: false, message: "Họ tên trống" });
      }
      if (!madaily) {
        return res
          .status(400)
          .json({ success: false, message: "Mã đại lý trống" });
      }
      if (!diachi) {
        return res
          .status(400)
          .json({ success: false, message: "Địa chỉ trống" });
      }
      if (!username) {
        return res
          .status(400)
          .json({ success: false, message: "Username trống" });
      }
      if (!password) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu trống" });
      }
      if (!gioitinh) {
        return res
          .status(400)
          .json({ success: false, message: "Giới tính trống" });
      }
      if (gioitinh && (gioitinh !== "nam" && gioitinh !== "nữ")) {
        return res
          .status(400)
          .json({ success: false, message: "Giới tính không hợp lệ" });
      }
      if (!role) {
        return res.status(400).json({ success: false, message: "Quyền trống" });
      }
      if (!sodienthoai) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại trống" });
      }
      if (sodienthoai.length != 10) {
        return res
          .status(400)
          .json({ message: "Số điện thoại phải đúng 10 số" });
      }
      if (!cmnd) {
        return res.status(400).json({ success: false, message: "CMND trống" });
      }
      if (!email) {
        return res.status(400).json({ success: false, message: "Email trống" });
      }
      if (!trangthai) {
        return res
          .status(400)
          .json({ success: false, message: "Trạng thái trống" });
      }
      if (!images.public_id) {
        return res.status(400).json({ success: false, message: "Ảnh trống" });
      }

      let updatedNhanVien = {
        hoten,
        madaily,
        diachi,
        username,
        password,
        gioitinh,
        role,
        sodienthoai,
        cmnd,
        email,
        trangthai,
        images,
      };

      updatedNhanVien = await NhanVien.findOneAndUpdate(
        { _id: req.params.id },
        updatedNhanVien,
        { new: true }
      );

      // User not authorised to update vattu
      if (!updatedNhanVien)
        return res
          .status(401)
          .json({ success: false, message: "Nhân viên không tìm thấy" });

      res.json({
        message: "Cập nhật thành công",
        nhanvien: updatedNhanVien,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const ktpn = await PhieuNhap.findOne({ manv: req.params.id });
      if (ktpn) {
        return res
          .status(401)
          .json({ message: "Nhân viên đã lập phiếu nhập. Không thể xóa !" });
      }
      const ktpx = await PhieuXuat.findOne({ manv: req.params.id });
      if (ktpx) {
        return res
          .status(401)
          .json({ message: "Nhân viên đã lập phiếu xuất. Không thể xóa !" });
      }
      if (!ktpn > 0 && !ktpx > 0) {
        const deleteNhanVien = await NhanVien.findOneAndDelete({
          _id: req.params.id,
        });
        if (!deleteNhanVien) {
          return res
            .status(401)
            .json({ message: "Không tìm thấy nhân viên cần xóa" });
        } else {
          return res.json({ message: "Xóa nhân viên thành công" });
        }
      }
    } catch (error) {
      // console.log(error)
      res.status(500).json({ message: "Xóa nhân viên thất bại" });
    }
  },
};

module.exports = employeeCtrl;
