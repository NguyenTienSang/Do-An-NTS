const { findOneAndUpdate } = require("../models/DaiLy");
const NhanVien = require("../models/NhanVien");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");

const validateEmail = (email) => {
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(email);
};

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
        // oldstore,
        // oldtrangthai,
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
      if (gioitinh && gioitinh !== "nam" && gioitinh !== "nữ") {
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
      if (!validateEmail(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Email không hợp lệ" });
      }
      if (!trangthai) {
        return res
          .status(400)
          .json({ success: false, message: "Trạng thái trống" });
      }
      if (!images.public_id) {
        return res.status(400).json({ message: "Ảnh trống" });
      }
   
      const nhanvien = await NhanVien.findById(req.body._id);
     
     
      //======================= New ========================
      //Th không thay đổi trạng thái

      //Đổi đại lý mà không đổi trạng thái chuyển công tác
      if (
        nhanvien.madaily.toString() !== madaily.toString() &&
        trangthai !== "Chuyển công tác"
      ) {
        console.log(
          "nhanvien.madaily.toString() : ",
          nhanvien.madaily.toString()
        );
        console.log("madaily : ", madaily);
        return res
          .status(400)
          .json({ message: "Vui lòng chọn trạng thái chuyển công tác" });
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
        images,
      };

      if (nhanvien.trangthai === trangthai) {
        //Kiểm tra username không trùng

        //Kierm tra số điện thoại không trùng
        const ktsodienthoai = await NhanVien.findOne({ sodienthoai });
        if (ktsodienthoai && sodienthoai !== nhanvien.sodienthoai) {
          return res
            .status(400)
            .json({ success: false, message: "Số điện thoại đã tồn tại" });
        }

        const ktemail = await NhanVien.findOne({ email });
        if (ktemail && email !== nhanvien.email) {
          return res
            .status(400)
            .json({ success: false, message: "Email đã tồn tại" });
        }

        //Kiểm tra cmnd không trùng
        const ktcmnd = await NhanVien.findOne({ cmnd });
        if (ktcmnd && cmnd !== nhanvien.cmnd) {
          return res.status(400).json({
            success: false,
            message: "Chứng minh nhân dân đã tồn tại",
          });
        }

        const update = await NhanVien.updateMany(
          { username: nhanvien.username },
          {
            $set: updatedNhanVien,
          }
        );

        if (!update.n) {
          return res.status(401).json({ message: "Cập nhật thất bại" });
        }

        return res.json({
          message: "Cập nhật thành công",
        });
      }
      //Trường hợp thay đổi trạng thái
      else {
        //========== Trường hợp đang làm ===========
        //Đổi trạng thái chuyển công tác mà không đổi đại lý
        if (
          trangthai === "Chuyển công tác" &&
          nhanvien.madaily.toString() === madaily.toString()
        ) {
          return res.status(400).json({ message: "Vui lòng chọn đại lý mới" });
        }

        //Đang làm -> Chuyển công tác
        if (
          nhanvien.trangthai === "Đang làm" &&
          trangthai === "Chuyển công tác"
        ) {
          //Kiểm tra xem đã có nhân viên trong đại lý chưa
          const kttontainvdaily = await NhanVien.findOne({
            username: username,
            madaily: madaily,
          });
          console.log("kttontainvdaily : ", kttontainvdaily);
          if (!kttontainvdaily) {
            //Nếu chưa có thì tạo ra nhân viên mới ở đại lý mới với trạng thái đang làm
            const newnhanvien = new NhanVien({
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
              trangthai: nhanvien.trangthai,
              images,
            });
            //Lưu vào mongodb
            await newnhanvien.save();
          } else {
            await NhanVien.findOneAndUpdate(
              { username: username, madaily: madaily },
              { trangthai: nhanvien.trangthai },
              { new: true }
            );
          }

          //Kiểm tra xem nếu đã từng lập phiếu nhập phiếu xuất thì cập nhật trạng thái
          //Nếu chưa từng lập trạng thái thì xóa nhân viên đó đi
          const phieunhap = await PhieuNhap.findOne({ manv: req.params.id });

          //Nếu có phiếu nhập thì cập nhật rồi trả về kết quả
          if (phieunhap) {
            //Cập nhật lại thông tin nhân viên
            updatedNhanVien = await NhanVien.findOneAndUpdate(
              { _id: req.params.id },
              { trangthai: trangthai },
              { new: true }
            );

            // User not authorised to update vattu
            if (!updatedNhanVien)
              return res.status(401).json({
                message: "Nhân viên không tìm thấy, chuyển trạng thái thất bại",
              });

            return res.json({
              message: "Chuyển nhân viên thành công",
            });
          }

          const phieuxuat = await PhieuXuat.findOne({ manv: req.params.id });
          //Nếu có phiếu xuất thì cập nhật rồi trả về kết quả
          if (phieuxuat) {
            updatedNhanVien = await NhanVien.findOneAndUpdate(
              { _id: req.params.id },
              { trangthai: trangthai },
              { new: true }
            );

            // User not authorised to update vattu
            if (!updatedNhanVien)
              return res.status(401).json({
                success: false,
                message: "Nhân viên không tìm thấy, chuyển trạng thái thất bại",
              });

            return res.json({
              message: "Chuyển nhân viên thành công",
            });
          }

          //Ngược lại chưa từng lập phiếu thì xóa nhân viên đi
          if (!phieunhap && !phieuxuat) {
            const deleteNhanVien = await NhanVien.findOneAndDelete({
              _id: req.params.id,
            });
            if (!deleteNhanVien) {
              return res.status(401).json({
                message:
                  "Không tìm thấy nhân viên cần xóa, chuyển trạng thái thất bại",
              });
            } else {
              return res.json({
                message: "Chuyển nhân viên thành công và xóa",
              });
            }
          }
        }
        //Đang làm -> Nghỉ việc -> Tài khoản sẽ bị khóa không đăng nhập được nữa -> Thông tin vẫn còn
        else if (
          nhanvien.trangthai === "Đang làm" &&
          trangthai === "Nghỉ việc"
        ) {
          await NhanVien.updateMany(
            { username: username },
            { $set: { trangthai: "Nghỉ việc" } }
          );
          return res.json({
            message: "Đã cập nhật trạng thái nghỉ việc",
          });
        }
        //========== Trường hợp chuyển công tác ===========
        // Chuyển công tác -> Đang làm
        else if (
          nhanvien.trangthai === "Chuyển công tác" &&
          trangthai === "Đang làm"
        ) {
          //Tìm nhân viên có trạng thái đang làm -> Chuyển công tác
          const updatetrangthainvcurrent = await NhanVien.findOneAndUpdate(
            { username: username, trangthai: trangthai },
            { trangthai: nhanvien.trangthai },
            { new: true }
          );

          // console.log("updatetrangthainvcurrent : ", updatetrangthainvcurrent);
          // if (!updatetrangthainvcurrent) {
          //   return res.status(401).json({
          //     message: "Chuyển trạng thái thất bại",
          //   });
          // }

          //Chuyển trạng thái đang công tác -> đang làm
          const updatetrangthainvclick = await NhanVien.findOneAndUpdate(
            { _id: req.params.id },
            { trangthai: "Đang làm" },
            { new: true }
          );
          if (!updatetrangthainvclick) {
            return res.status(401).json({
              message: "Chuyển trạng thái thất bại",
            });
          }

          return res.json({
            message: "Cập nhật trạng thái thành công",
          });
        }

        //Chuyển công tác -> Nghỉ việc
        //Tài khoản sẽ bị khóa
        else if (
          nhanvien.trangthai === "Chuyển công tác" &&
          trangthai === "Nghỉ việc"
        ) {
          await NhanVien.updateMany(
            { username: username },
            { $set: { trangthai: "Nghỉ việc" } }
          );
          return res.json({
            message: "Đã cập nhật trạng thái nghỉ việc",
          });
        }

        //Nghỉ việc -> Đang làm
        //Cập nhật tất cả trạng thái về chuyển công tác -> Chuyển trạng thái nhân viên vừa chọn về đang làm
        else if (
          nhanvien.trangthai === "Nghỉ việc" &&
          trangthai === "Đang làm"
        ) {
          await NhanVien.updateMany(
            { username: username },
            { $set: { trangthai: "Chuyển công tác" } }
          );

          const updatetrangthainvclick = await NhanVien.findOneAndUpdate(
            { _id: req.params.id },
            { trangthai: "Đang làm" },
            { new: true }
          );
          if (!updatetrangthainvclick) {
            return res.status(401).json({
              message: "Chuyển trạng thái thất bại",
            });
          }

          return res.json({
            message: "Cập nhật trạng thái thành công",
          });
        } else if (
          nhanvien.trangthai === "Nghỉ việc" &&
          trangthai === "Chuyển công tác"
        ) {
          return res.status(401).json({
            message: "Trạng thái không phù hợp",
          });
        }
      }

      //====================================================
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      console.log("req.params.id : ", req.params.id);
      console.log("PhieuNhap : ", PhieuNhap);
      const ktpn = await PhieuNhap.findOne({ manv: req.params.id });
      if (ktpn) {
        return res.status(401).json({
          success: false,
          message: "Nhân viên đã lập phiếu nhập. Không thể xóa !",
        });
      }
      const ktpx = await PhieuXuat.findOne({ manv: req.params.id });
      if (ktpx) {
        return res.status(401).json({
          success: false,
          message: "Nhân viên đã lập phiếu xuất. Không thể xóa !",
        });
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
          return res.json({
            success: true,
            message: "Xóa nhân viên thành công",
          });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Xóa nhân viên thất bại" });
    }
  },
};

module.exports = employeeCtrl;
