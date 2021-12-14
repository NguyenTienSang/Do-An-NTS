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
      const { tenkho, madaily, diachi, sodienthoai, trangthai, images } =
        req.body;
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

      const kho = await Kho.findById(req.body._id);
      //======================= New ========================
      console.log("kho.madaily.toString() : ", kho.madaily.toString());
      console.log("madaily.toString() : ", madaily.toString());
      console.log("trangthai : ", trangthai);
      if (
        kho.madaily.toString() !== madaily.toString() &&
        trangthai !== "Chuyển kho"
      ) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn trạng thái chuyển kho" });
      }

      let updatedKho = {
        tenkho,
        madaily,
        diachi,
        sodienthoai,
        trangthai,
        images,
      };

      if (kho.trangthai === trangthai) {
        const kttenkho = await Kho.findOne({ tenkho });

        if (kttenkho && tenkho !== kho.tenkho) {
          return res
            .status(400)
            .json({ success: false, message: "Tên kho đã tồn tại" });
        }

        const ktsodienthoai = await Kho.findOne({ sodienthoai });
        if (ktsodienthoai && sodienthoai !== kho.sodienthoai) {
          return res
            .status(400)
            .json({ success: false, message: "Số điện thoại đã tồn tại" });
        }

        const update = await Kho.updateMany(
          { sodienthoai: kho.sodienthoai },
          {
            $set: updatedKho,
          }
        );

        if (!update.n) {
          return res.status(401).json({ message: "Cập nhật thất bại" });
        }

        return res.json({
          message: "Cập nhật thành công",
        });
      } else {
        //============ Trường hợp =============
        //Đổi trạng thái chuyển kho mà không đổi đại lý
        if (
          trangthai === "Chuyển kho" &&
          kho.madaily.toString() === madaily.toString()
        ) {
          return res.status(400).json({ message: "Vui lòng chọn đại lý mới" });
        }

        //Đang hoạt động -> Chuyển kho
        if (kho.trangthai === "Đang hoạt động" && trangthai === "Chuyển kho") {
          //Kiểm tra kho có vật tư tồn hay không
          if (await checkTonKho(kho.madaily, kho._id)) {
            return res.status(401).json({
              message: "Kho còn vật tư tồn, không thể chuyển trạng thái",
            });
          } else {
            const kttontaikhodaily = await Kho.findOne({
              madaily: madaily,
              sodienthoai: sodienthoai,
            });

            console.log("kttontaikhodaily : ", kttontaikhodaily);
            //Nếu chưa có kho trong đại lý đó -> tạo mới
            if (!kttontaikhodaily) {
              console.log("tạo ra kho mới");
              const newKho = new Kho({
                tenkho,
                madaily,
                diachi,
                sodienthoai,
                trangthai: kho.trangthai,
                images,
              });
              //Lưu vào mongodb
              await newKho.save();
            } else {
              await Kho.findOneAndUpdate(
                {
                  madaily: madaily,
                  sodienthoai: sodienthoai,
                },
                { trangthai: kho.trangthai },
                { new: true }
              );
            }

            //Kiểm tra trong phiếu nhập có kho chưa
            const phieunhap = await PhieuNhap.findOne({
              makho: req.params.id,
            });
            if (phieunhap) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: req.params.id },
                { trangthai: trangthai },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });

              return res.json({
                message: "Chuyển kho thành công",
              });
            }

            //Kiểm tra trong phiếu xuất có kho chưa
            const phieuxuat = await PhieuXuat.findOne({
              makho: req.params.id,
            });
            if (phieuxuat) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: req.params.id },
                { trangthai: trangthai },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });

              return res.json({
                message: "Chuyển kho thành công",
              });
            }

            //Ngược lại chưa từng lập phiếu thì xóa kho đi
            if (!phieunhap && !phieuxuat) {
              const deleteKho = await Kho.findOneAndDelete({
                _id: req.params.id,
              });
              if (!deleteKho) {
                return res.status(401).json({
                  message:
                    "Không tìm thấy kho cần xóa, chuyển trạng thái thất bại",
                });
              } else {
                return res.json({
                  message: "Chuyển kho thành công và xóa",
                });
              }
            }
          }
        } else if (
          kho.trangthai === "Đang hoạt động" &&
          trangthai === "Ngừng hoạt động"
        ) {
          if (await checkTonKho(kho.madaily, kho._id)) {
            return res.status(401).json({
              message: "Kho còn vật tư tồn, không thể chuyển trạng thái",
            });
          } else {
            await Kho.updateMany(
              { sodienthoai: sodienthoai },
              { $set: { trangthai: "Ngừng hoạt động" } }
            );
            return res.json({
              message: "Đã cập nhật trạng thái ngừng hoạt động",
            });
          }
        } else if (
          kho.trangthai === "Chuyển kho" &&
          trangthai === "Đang hoạt động"
        ) {
          //Tìm kho đang hoạt động
          const kttontaikhodaily = await Kho.findOne({
            sodienthoai: sodienthoai,
            trangthai: "Đang hoạt động",
          });

          if (!kttontaikhodaily) {
            return res.status(401).json({
              message: "Chuyển trạng thái thất bại",
            });
          }

          if (
            await checkTonKho(kttontaikhodaily.madaily, kttontaikhodaily._id)
          ) {
            return res.status(401).json({
              message: "Kho còn vật tư tồn, không thể chuyển trạng thái",
            });
          } else {
            //Kiểm tra trong phiếu nhập có kho chưa (kho đang hoạt động)
            const phieunhap = await PhieuNhap.findOne({
              makho: kttontaikhodaily._id,
            });
            if (phieunhap) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: kttontaikhodaily._id },
                { trangthai: "Chuyển kho" },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });
            }

            //Kiểm tra trong phiếu xuất có kho chưa
            const phieuxuat = await PhieuXuat.findOne({
              makho: kttontaikhodaily._id,
            });
            if (phieuxuat) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: kttontaikhodaily._id },
                { trangthai: "Chuyển kho" },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });

              // return res.json({
              //   message: "Chuyển kho thành công",
              // });
            }

            //Ngược lại chưa từng lập phiếu thì xóa kho đi
            if (!phieunhap && !phieuxuat) {
              const deleteKho = await Kho.findOneAndDelete({
                _id: kttontaikhodaily._id,
              });
              if (!deleteKho) {
                return res.status(401).json({
                  message:
                    "Không tìm thấy kho cần xóa, chuyển trạng thái thất bại",
                });
              }
              // else {
              //   return res.json({
              //     message: "Chuyển kho thành công và xóa",
              //   });
              // }
            }

            //Chuyển trạng thái đang công tác -> đang làm
            const updatetrangthaikhoclick = await Kho.findOneAndUpdate(
              { _id: req.params.id },
              { trangthai: "Đang hoạt động" },
              { new: true }
            );
            if (!updatetrangthaikhoclick) {
              return res.status(401).json({
                message: "Chuyển trạng thái thất bại",
              });
            }

            return res.json({
              message: "Cập nhật trạng thái thành công",
            });
          }
        } else if (
          kho.trangthai === "Chuyển kho" &&
          trangthai === "Ngừng hoạt động"
        ) {
          //Tìm kho đang hoạt động
          const kttontaikhodaily = await Kho.findOne({
            sodienthoai: sodienthoai,
            trangthai: "Đang hoạt động",
          });

          if (!kttontaikhodaily) {
            return res.status(401).json({
              message: "Chuyển trạng thái thất bại",
            });
          }

          if (
            await checkTonKho(kttontaikhodaily.madaily, kttontaikhodaily._id)
          ) {
            return res.status(401).json({
              message: "Kho còn vật tư tồn, không thể chuyển trạng thái",
            });
          } else {
            //Kiểm tra kho đang hoạt động có phiếu nhập phiếu xuất chưa
            const phieunhap = await PhieuNhap.findOne({
              makho: kttontaikhodaily._id,
            });
            if (phieunhap) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: kttontaikhodaily._id },
                { trangthai: "Chuyển kho" },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });
            }

            //Kiểm tra trong phiếu xuất có kho chưa

            const phieuxuat = await PhieuXuat.findOne({
              makho: kttontaikhodaily._id,
            });
            if (phieuxuat) {
              updatedKho = await Kho.findOneAndUpdate(
                { _id: kttontaikhodaily._id },
                { trangthai: "Chuyển kho" },
                { new: true }
              );

              if (!updatedKho)
                return res.status(401).json({
                  message: "Kho không tìm thấy, chuyển trạng thái thất bại",
                });
            }

            //Ngược lại chưa từng lập phiếu thì xóa kho đi
            if (!phieunhap && !phieuxuat) {
              const deleteKho = await Kho.findOneAndDelete({
                _id: kttontaikhodaily._id,
              });
              if (!deleteKho) {
                return res.status(401).json({
                  message:
                    "Không tìm thấy kho cần xóa, chuyển trạng thái thất bại",
                });
              }
            }

            //=======================================================
            await Kho.updateMany(
              { sodienthoai: sodienthoai },
              { $set: { trangthai: "Ngừng hoạt động" } }
            );
            return res.json({
              message: "Đã cập nhật trạng thái ngừng hoạt động",
            });
          }
        } else if (
          kho.trangthai === "Ngừng hoạt động" &&
          trangthai === "Đang hoạt động"
        ) {
          await Kho.updateMany(
            { sodienthoai: sodienthoai },
            { $set: { trangthai: "Chuyển kho" } }
          );

          const updatetrangthaikhoclick = await Kho.findOneAndUpdate(
            { _id: req.params.id },
            { trangthai: "Đang hoạt động" },
            { new: true }
          );
          if (!updatetrangthaikhoclick) {
            return res.status(401).json({
              message: "Chuyển trạng thái thất bại",
            });
          }

          return res.json({
            message: "Cập nhật trạng thái thành công",
          });
        } else if (
          kho.trangthai === "Ngừng hoạt động" &&
          trangthai === "Chuyển kho"
        ) {
          return res.status(401).json({
            message: "Trạng thái không phù hợp",
          });
        }
      }

      //====================================================
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  deleteWareHouse: async (req, res) => {
    try {
      //Kiểm tra kho này đã có phiếu nhập chưa
      const ktpn = await PhieuNhap.findOne({ makho: req.params.id });
      if (ktpn) {
        return res.status(401).json({
          success: false,
          message: "Kho đã có phiếu nhập. Không thể xóa !",
        });
      }
      //Kiểm tra kho này đã có phiếu xuất chưa
      const ktpx = await PhieuXuat.findOne({ makho: req.params.id });
      if (ktpx) {
        return res.status(401).json({
          success: false,
          message: "Kho đã có phiếu xuất. Không thể xóa !",
        });
      }
      if (!ktpn > 0 && !ktpx > 0) {
        const deleteKho = await Kho.findOneAndDelete({ _id: req.params.id });
        // console.log("Đã xóa kho : ", deleteKho);
        if (!deleteKho) {
          return res
            .status(401)
            .json({ success: false, message: "Không tìm thấy kho cần xóa" });
        } else {
          return res.json({ success: true, message: "Xóa kho thành công" });
        }
      }
    } catch (error) {
      // console.log(error)
      res.status(500).json({ success: false, message: "Xóa kho thất bại" });
    }
  },
};

const checkTonKho = async (madailyfilter, makhofilter) => {
  const listmaterialfilter = [];
  const phieunhap = await PhieuNhap.find()
    .populate("manv")
    .populate("makho")
    .populate({ path: "ctpn", populate: { path: "mavt" } });
  const phieuxuat = await PhieuXuat.find()
    .populate("manv")
    .populate("makho")
    .populate({ path: "ctpx", populate: { path: "mavt" } });
  //Lọc phiếu nhập
  const filterpn = phieunhap?.filter((pn) => {
    return (
      makhofilter === pn.makho._id.toString() &&
      madailyfilter === pn.manv.madaily.toString()
    );
  });

  //Lọc phiếu xuất
  const filterpx = phieuxuat?.filter((px) => {
    return (
      makhofilter == px.makho._id.toString() &&
      madailyfilter === px.manv.madaily.toString()
    );
  });

  filterpn?.map((pn) => {
    pn.ctpn?.map((ctpn) => {
      const timvattu = listmaterialfilter.find((listmaterialitem) => {
        if (ctpn.mavt._id.toString() === listmaterialitem._id.toString()) {
          listmaterialitem.soluong += ctpn.soluong; //Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
        }
        return ctpn.mavt._id.toString() === listmaterialitem._id.toString();
      });

      if (timvattu === undefined) {
        listmaterialfilter.push({
          _id: ctpn.mavt._id,
          tenvt: ctpn.mavt.tenvt,
          soluong: ctpn.soluong,
          gianhap: ctpn.mavt.gianhap,
          giaxuat: ctpn.mavt.giaxuat,
          donvi: ctpn.mavt.donvi,
          trangthai: ctpn.mavt.trangthai,
          images: ctpn.mavt.images,
        });
      }
    });
  });

  filterpx?.map((px) => {
    px.ctpx?.map((ctpx) => {
      listmaterialfilter.find((listmaterialitem) => {
        if (ctpx.mavt._id.toString() === listmaterialitem._id.toString()) {
          listmaterialitem.soluong -= ctpx.soluong;
        }
        return ctpx.mavt._id.toString() === listmaterialitem._id.toString();
      });
    });
  });

  const checkton = listmaterialfilter.some((itemstorage) => {
    return itemstorage.soluong > 0;
  });
  console.log("checkton : ", checkton);
  return checkton;
};

module.exports = warehouseCtrl;
