const NhanVien = require("../models/NhanVien");
const PhieuNhap = require("../models/PhieuNhap");
const PhieuXuat = require("../models/PhieuXuat");
const DaiLy = require("../models/DaiLy");
const Kho = require("../models/Kho");
const VatTu = require("../models/VatTu");

const statisticCtrl = {
  searchMaterialImportBills: async (req, res) => {
    //lấy danh sách vật tư của cửa hàng gán bằng 0
    const vattu = await VatTu.find();

    const { makhofilter } = req.body;
    //Tiến hành lấy danh sách vật tư đã có trong kho

    const listmaterialfilter = [];
    const phieunhap = await PhieuNhap.find()
      .populate("manv")
      .populate({ path: "ctpn", populate: { path: "mavt" } });
    const phieuxuat = await PhieuXuat.find()
      .populate("manv")
      .populate({ path: "ctpx", populate: { path: "mavt" } });

    //Lọc phiếu nhập
    const filterpn = phieunhap?.filter((pn) => {
      return makhofilter == pn.makho;
    });

    //Lọc phiếu xuất
    const filterpx = phieuxuat?.filter((px) => {
      return makhofilter == px.makho;
    });

    //Lọc ra những vật tư có trong phiếu nhập
    // try {
    filterpn?.map((pn) => {
      pn.ctpn?.map((ctpn) => {
        const timvattu = listmaterialfilter.find((listmaterialitem) => {
          if (ctpn.mavt._id === listmaterialitem._id) {
            listmaterialitem.soluong += ctpn.soluong; //Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
          }
          return ctpn.mavt._id === listmaterialitem._id;
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

    //Lọc ra những vật tư có trong phiếu xuất
    filterpx?.map((px) => {
      px.ctpx?.map((ctpx) => {
        listmaterialfilter.find((listmaterialitem) => {
          if (ctpx.mavt._id.toString() === listmaterialitem._id.toString()) {
            listmaterialitem.soluong -= ctpx.soluong;
          }
          return ctpx.mavt._id === listmaterialitem._id;
        });
      });
    });

    //Tiến hành gán vật tư có trong danh sách vật tư của kho thì lấy số lượng đó cho bằng số lượng vật tư tìm kiếm
    //Những vật  tư không có sẽ có giá trị là 0

    // res.json(listmaterialfilter)

    vattu.map((vattuitem) => {
      const checkExistMaterial = listmaterialfilter.find(
        (materialfilteritem) => {
          return materialfilteritem._id.toString() === vattuitem._id.toString();
        }
      );
      if (checkExistMaterial === undefined) {
        vattuitem.soluong = 0;
      } else {
        vattuitem.soluong = checkExistMaterial.soluong;
      }
    });

    return res.json(vattu);
  },

  statisticMaterials: async (req, res) => {
    try {
      const { madailyfilter, makhofilter } = req.body;

      if (madailyfilter === "allstores") {
        console.log("Chọn toàn đại lý");
        const vattu = await VatTu.find();
        return res.json(vattu);
      } else {
        if (makhofilter === "allwarehouses") {
          console.log("Chọn đại lý cụ thể, chọn toàn kho");
          const listmaterialfilter = [];
          const phieunhap = await PhieuNhap.find()
            .populate("manv")
            .populate("makho")
            .populate({ path: "ctpn", populate: { path: "mavt" } });
          const phieuxuat = await PhieuXuat.find()
            .populate("manv")
            .populate("makho")
            .populate({ path: "ctpx", populate: { path: "mavt" } });

          // console.log("phieunhap : ", phieunhap);

          //Lấy danh sách phiếu nhập trong đại lý và kho còn hoạt động
          // console.log("madailyfilter : ", madailyfilter);
          // console.log("typeof(madailyfilter) : ", typeof madailyfilter);
          const filterpn = phieunhap.filter((pn) => {
            return (
              madailyfilter === pn.manv.madaily.toString() &&
              pn.makho.trangthai === "Đang hoạt động"
            );
          });

          //Lấy danh sách phiếu xuất trong đại lý và kho còn hoạt động
          const filterpx = phieuxuat.filter((px) => {
            return (
              madailyfilter === px.manv.madaily.toString() &&
              px.makho.trangthai === "Đang hoạt động"
            );
          });

          //Lọc phiếu nhập
          filterpn?.map((pn) => {
            pn.ctpn?.map((ctpn) => {
              // if (ctpn.mavt.tenvt === "Đồng đỏ") {
              //   console.log("ctpn.soluong : ", ctpn.soluong);
              // }
              const timvattu = listmaterialfilter.find((listmaterialitem) => {
                if (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  listmaterialitem.soluong += ctpn.soluong;
                }
                return (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                );
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
          //Lọc phiếu xuất

          filterpx?.map((px) => {
            px.ctpx?.map((ctpx) => {
              listmaterialfilter.find((listmaterialitem) => {
                if (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  listmaterialitem.soluong -= ctpx.soluong; //Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                }
                return (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                );
              });
            });
          });
          return res.json(listmaterialfilter);
        } //Chọn đại lý, chọn kho cụ thể
        else if (
          madailyfilter !== "allstores" &&
          makhofilter !== "allwarehouses"
        ) {
          console.log("Chọn đại lý cụ thể và kho cụ thể");
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
                if (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  listmaterialitem.soluong += ctpn.soluong; //Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                }
                return (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                );
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
                if (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  listmaterialitem.soluong -= ctpx.soluong;
                }
                return (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                );
              });
            });
          });
          return res.json(listmaterialfilter);
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Thống kê thất bại" });
    }
  },
  statisticMaterialsInListWareHouse: async (req, res) => {
    try {
      const { mavattu } = req.body;

      const listwarehouse = [];

      const phieunhap = await PhieuNhap.find({
        "ctpn.mavt": { $in: [mavattu] },
      })
        .populate("makho")
        .populate({ path: "makho", populate: { path: "madaily" } })
        .populate({ path: "ctpn", populate: { path: "mavt" } });

      const phieuxuat = await PhieuXuat.find({
        "ctpx.mavt": { $in: [mavattu] },
      })
        .populate("makho")
        .populate({ path: "ctpx", populate: { path: "mavt" } });

      let timkho = "";

      phieunhap?.map((pn) => {
        // console.log("pn : ", pn);
        pn.ctpn?.map((ctpn) => {
          // console.log("ctpn.mavt._id.toString() : ", ctpn.mavt._id.toString());
          // console.log("mavattu : ", mavattu);
          if (ctpn.mavt._id.toString() === mavattu) {
            // console.log("Vô nè");
            timkho = listwarehouse.find((listwarehouseitem) => {
              if (
                pn.makho._id.toString() === listwarehouseitem._id.toString()
              ) {
                listwarehouseitem.soluong += ctpn.soluong;
              }
              return (
                pn.makho._id.toString() === listwarehouseitem._id.toString()
              );
            });

            if (timkho === undefined) {
              listwarehouse.push({
                _id: pn.makho._id,
                tenkho: pn.makho.tenkho,
                diachi: pn.makho.diachi,
                sodienthoai: pn.makho.sodienthoai,
                images: pn.makho.images,
                soluong: ctpn.soluong,
                tendl: pn.makho.madaily.tendl,
              });
            }
          }
        });
      });

      phieuxuat?.map((px) => {
        px.ctpx?.map((ctpx) => {
          if (ctpx.mavt._id.toString() === mavattu) {
            listwarehouse.find((listwarehouseitem) => {
              if (
                px.makho._id.toString() === listwarehouseitem._id.toString()
              ) {
                listwarehouseitem.soluong -= ctpx.soluong;
                // console.log("Giảm số lượng");
              }
              return (
                px.makho._id.toString() === listwarehouseitem._id.toString()
              );
            });
          }
        });
      });
      // return res.json(phieunhap);
      return res.json(listwarehouse);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  statisticImportBillEmployees: async (req, res) => {
    try {
      const { manv, startDateFilter, endDateFilter, optionbill } = req.body;
      console.log("manv : ", manv);
      console.log("startDateFilter : ", startDateFilter);
      console.log("startDateFilter : ", typeof startDateFilter);
      console.log("endDateFilter : ", endDateFilter);
      console.log("endDateFilter : ", typeof endDateFilter);
      console.log("optionbill : ", optionbill);

      const datestart = new Date(startDateFilter);
      const dateend = new Date(endDateFilter); //Khởi điểm là 0h của ngày đó
      dateend.setDate(dateend.getDate() + 1); //Nên cộng thêm một ngày nữa để chính xác

      //Trường hợp phiếu nhập
      if (optionbill === "PhieuNhap") {
        const phieunhap = await PhieuNhap.find({
          manv: manv,
          ngay: { $gte: datestart, $lte: dateend },
        })
          .populate("manv")
          .populate({ path: "manv", populate: { path: "madaily" } })
          .populate("makho")
          .populate("ctpn")
          .populate({ path: "ctpn", populate: { path: "mavt" } });

        return res.json(phieunhap);
      } else if (optionbill === "PhieuXuat") {
        const phieuxuat = await PhieuXuat.find({
          manv: manv,
          ngay: { $gte: datestart, $lte: dateend },
        })
          .populate("manv")
          .populate({ path: "manv", populate: { path: "madaily" } })
          .populate("makho")
          .populate("ctpx")
          .populate({ path: "ctpx", populate: { path: "mavt" } });

        return res.json(phieuxuat);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* */
  /* Truyền vào mã đại lý, mã kho
    Nếu đại lý == allstores là tất cả đại lý -> trả vật danh sách vật tư của toàn đại lý

    Trường hợp là đại lý cụ thể
    +Tất cả kho: Lọc danh sách phiếu nhập -> Nếu mà mã kho.daily == id đại lý
    thì trả về mảng tạm
    -> Tìm kiếm nếu vật có trong mảng tạm đó thì tăng số lượng lên, nếu không thì thêm mới

        Lọc phiếu xuất -> Nếu mà
    + Kho cụ thể: Lọc danh sách

    */

  statisticBillEmployees: async (req, res) => {
    try {
      const { manv } = req.body;
      const date = new Date();

      var statisticProfit = {
        sophieunhapday: 0,
        sophieuxuatday: 0,
        chiphinhapday: 0,
        chiphixuatday: 0,

        sophieunhapmonth: 0,
        sophieuxuatmonth: 0,
        chiphinhapmonth: 0,
        chiphixuatmonth: 0,

        sophieunhapyear: 0,
        sophieuxuatyear: 0,
        chiphinhapyear: 0,
        chiphixuatyear: 0,
      };

      const phieunhapday = await PhieuNhap.find({
        $and: [
          { manv: { $eq: manv } },
          {
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: "$ngay" }, date.getDate()] },
                { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
                { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
              ],
            },
          },
        ],
      }).select({ ctpn: 1, ngay: 1, _id: 0 });
      const phieuxuatday = await PhieuXuat.find({
        $and: [
          { manv: { $eq: manv } },
          {
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: "$ngay" }, date.getDate()] },
                { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
                { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
              ],
            },
          },
        ],
      }).select({ ctpx: 1, ngay: 1, _id: 0 });

      const phieunhapmonth = await PhieuNhap.find({
        $and: [
          { manv: { $eq: manv } },
          {
            $expr: {
              $and: [
                { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
                { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
              ],
            },
          },
        ],
      }).select({ ctpn: 1, ngay: 1, _id: 0 });
      const phieuxuatmonth = await PhieuXuat.find({
        $and: [
          { manv: { $eq: manv } },
          {
            $expr: {
              $and: [
                { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
                { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
              ],
            },
          },
        ],
      }).select({ ctpx: 1, ngay: 1, _id: 0 });

      const phieunhapyear = await PhieuNhap.find({
        $and: [
          { manv: { $eq: manv } },
          { $expr: { $eq: [{ $year: "$ngay" }, date.getFullYear()] } },
        ],
      }).select({ ctpn: 1, ngay: 1, _id: 0 });
      const phieuxuatyear = await PhieuXuat.find({
        $and: [
          { manv: { $eq: manv } },
          { $expr: { $eq: [{ $year: "$ngay" }, date.getFullYear()] } },
        ],
      }).select({ ctpx: 1, ngay: 1, _id: 0 });

      // //    //Thống kê ngày
      //Phiếu nhập
      phieunhapday.forEach((pn) => {
        statisticProfit.sophieunhapday++;
        pn.ctpn.forEach((ctpn) => {
          statisticProfit.chiphinhapday += parseInt(
            ctpn.gianhap * ctpn.soluong
          );
        });
      });

      // //    Phiếu xuất
      phieuxuatday.forEach((px) => {
        statisticProfit.sophieuxuatday++;
        px.ctpx.forEach((ctpx) => {
          statisticProfit.chiphixuatday += parseInt(
            ctpx.giaxuat * ctpx.soluong
          );
        });
      });

      //Thống kê tháng
      //Phiếu nhập
      phieunhapmonth.forEach((pn) => {
        statisticProfit.sophieunhapmonth++;
        pn.ctpn.forEach((ctpn) => {
          statisticProfit.chiphinhapmonth += parseInt(
            ctpn.gianhap * ctpn.soluong
          );
        });
      });

      //    Phiếu xuất
      phieuxuatmonth.forEach((px) => {
        statisticProfit.sophieuxuatmonth++;
        px.ctpx.forEach((ctpx) => {
          statisticProfit.chiphixuatmonth += parseInt(
            ctpx.giaxuat * ctpx.soluong
          );
        });
      });

      //Thống kê năm
      //Phiếu nhập
      phieunhapyear.forEach((pn) => {
        statisticProfit.sophieunhapyear++;
        pn.ctpn.forEach((ctpn) => {
          statisticProfit.chiphinhapyear += parseInt(
            ctpn.gianhap * ctpn.soluong
          );
        });
      });

      //    Phiếu xuất
      phieuxuatyear.forEach((px) => {
        statisticProfit.sophieuxuatyear++;
        px.ctpx.forEach((ctpx) => {
          statisticProfit.chiphixuatyear += parseInt(
            ctpx.giaxuat * ctpx.soluong
          );
        });
      });

      return res.json({ statisticProfit });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //Thống kê doanh thu theo mốc thời gian
  statisticTurnOverTime: async (req, res) => {
    const { madailyfilter, timestatistic, optionstatistic } = req.body;

    if (optionstatistic === "Ngay") {
      const date = new Date(timestatistic);

      const phieuxuat = await PhieuXuat.find({
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$ngay" }, date.getDate()] },
            { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
            { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
          ],
        },
      })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } })
        .populate("makho")
        .populate("ctpx")
        .populate({ path: "ctpx", populate: { path: "mavt" } });

      const dataStatistic = phieuxuat.filter((px) => {
        return px.manv.madaily._id.toString() === madailyfilter;
      });

      return res.json(dataStatistic);
    } else if (optionstatistic === "Thang") {
      const phieuxuat = await PhieuXuat.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$ngay" }, parseInt(timestatistic.slice(5, 8))] },
            { $eq: [{ $year: "$ngay" }, parseInt(timestatistic.slice(0, 4))] },
          ],
        },
      })
        .select({ ctpx: 1, ngay: 1, _id: 0 })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } });

      var statisticProfitMonth = [];

      let ngay = 0;
      let tongtienxuat = 0;

      const numberday = new Date(
        parseInt(timestatistic.slice(0, 4)),
        parseInt(timestatistic.slice(5, 8)),
        0
      ).getDate();

      // console.log("numberday : ", numberday);
      // console.log("typeof(numberday) : ", typeof numberday);

      for (var i = 0; i < numberday; i++) {
        statisticProfitMonth.push({
          ngay: i + 1,
          sophieuxuat: 0,
          tongtienxuat: 0,
        });
      }

      //Phiếu xuất
      phieuxuat.map((px) => {
        if (px.manv.madaily._id.toString() === madailyfilter) {
          ngay = parseInt(JSON.stringify(px.ngay).slice(9, 12));
          px.ctpx.map((ctpx) => {
            tongtienxuat += parseInt(ctpx.giaxuat * ctpx.soluong);
          });
          statisticProfitMonth[ngay - 1].sophieuxuat++;
          statisticProfitMonth[ngay - 1].tongtienxuat += tongtienxuat;
          tongtienxuat = 0;
        }
      });

      return res.json(statisticProfitMonth);
    } else if (optionstatistic === "Nam") {
      const phieuxuat = await PhieuXuat.find({
        $expr: { $eq: [{ $year: "$ngay" }, parseInt(timestatistic)] },
      })
        .select({ ctpx: 1, ngay: 1, _id: 0 })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } });

      var statisticProfitYear = [];

      let thang = 0;
      let tongtienxuat = 0;

      for (var i = 0; i < 12; i++) {
        statisticProfitYear.push({
          thang: i + 1,
          sophieuxuat: 0,
          tongtienxuat: 0,
        });
      }

      //Phiếu xuất
      phieuxuat.map((px) => {
        if (px.manv.madaily._id.toString() === madailyfilter) {
          thang = JSON.stringify(px.ngay).slice(6, 8);
          px.ctpx.map((ctpx) => {
            tongtienxuat += parseInt(ctpx.giaxuat * ctpx.soluong);
          });
          statisticProfitYear[thang - 1].sophieuxuat++;
          statisticProfitYear[thang - 1].tongtienxuat += tongtienxuat;
          tongtienxuat = 0;
        }
      });
      return res.json(statisticProfitYear);
    }
  },

  //Thống kê lợi nhuận năm
  statisticProfitYear: async (req, res) => {
    //Lấy ra danh sách phiếu nhập theo tháng

    const { madailyfilter, yearstatistic } = req.body;

    if (!madailyfilter) {
      return res.status(400).json({ message: "Vui lòng chọn đại lý" });
    }

    if (!yearstatistic) {
      return res.status(400).json({ message: "Vui lòng chọn năm" });
    }

    //======================= Tính giá trung bình nhập ============================
    // const listmaterialaverage = [];

    // const listphieunhap = await PhieuNhap.find().populate("manv");
    // const listphieuxuat = await PhieuXuat.find().populate("manv");

    // listphieunhap.map((itemphieunhap) => {
    //   if (
    //     itemphieunhap.manv.madaily._id.toString() === madailyfilter.toString()
    //   ) {
    //     itemphieunhap.ctpn.map((ctpn) => {
    //       const timvattu = listmaterialaverage.find(
    //         (listmaterialaverageitem) => {
    //           if (ctpn.mavt === listmaterialaverageitem._id) {
    //             listmaterialaverageitem.giatbnhap += ctpn.gianhap;
    //             lannhap++;
    //           }
    //           return ctpn.mavt === listmaterialaverageitem._id;
    //         }
    //       );

    //       if (timvattu === undefined) {
    //         listmaterialaverage.push({
    //           _id: ctpn.mavt,
    //           giatbnhap: ctpn.gianhap,
    //           lannhap: 1,
    //           giatbxuat: 0,
    //           lanxuat: 0,
    //         });
    //       }
    //     });
    //   }
    // });

    // console.log("listmaterialaverage test : ", listmaterialaverage);
    // listphieuxuat.map((itemphieuxuat) => {
    //   if (
    //     itemphieuxuat.manv.madaily._id.toString() === madailyfilter.toString()
    //   ) {
    //     itemphieuxuat.ctpx.map((ctpx) => {
    //       const timvattu = listmaterialaverage.find(
    //         (listmaterialaverageitem) => {
    //           if (ctpx.mavt === listmaterialaverageitem._id) {
    //             listmaterialaverageitem.giatbxuat += ctpx.giaxuat;
    //             lanxuat++;
    //           }
    //           return ctpx.mavt === listmaterialaverageitem._id;
    //         }
    //       );

    //       if (timvattu === undefined) {
    //         listmaterialaverage.push({
    //           _id: ctpx.mavt,
    //           giatbnhap: 0,
    //           lannhap: 0,
    //           giatbxuat: ctpx.giaxuat,
    //           lanxuat: 1,
    //         });
    //       }
    //     });
    //   }
    // });

    // listmaterialaverage.map((item) => {
    //   item.giatbnhap = Math.round(item.giatbnhap / item.lannhap);
    //   item.giatbxuat = Math.round(item.giatbxuat / item.lanxuat);
    // });

    // console.log("listmaterialaverage : ", listmaterialaverage);

    //==========================================================

    var statisticProfitYear = [];

    var element = {
      thang: "",
      sophieunhap: 0,
      sophieuxuat: 0,
      chiphinhap: 0,
      chiphixuat: 0,
      loinhuan: 0,
    };

    const phieunhap = await PhieuNhap.find({
      $expr: { $eq: [{ $year: "$ngay" }, yearstatistic] },
    })
      .sort({ ngay: 1 })
      .select({ ctpn: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });
    const phieuxuat = await PhieuXuat.find({
      $expr: { $eq: [{ $year: "$ngay" }, yearstatistic] },
    })
      .sort({ ngay: 1 })
      .select({ ctpx: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });

    // console.log("phieunhap : ", phieunhap);
    // console.log("phieuxuat : ", phieuxuat);

    // //============== NEW =================
    // let vattuitem = "";
    // if (madailyfilter === "allstores") {
    //   for (var i = 1; i <= 12; i++) {
    //     element.thang = i;
    //     element.sophieunhap =
    //       element.sophieuxuat =
    //       element.chiphinhap =
    //       element.chiphixuat =
    //       element.loinhuan =
    //         0;

    //     //Phiếu nhập
    //     phieunhap.map((pn) => {
    //       if (parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i) {
    //         element.sophieunhap++;
    //         pn.ctpn.map((ctpn) => {
    //           element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
    //           vattuitem = listmaterialaverage.find((item) => {
    //             return item._id.toString() === ctpn.mavt.toString();
    //           });
    //           element.loinhuan -= vattuitem.giatbnhap * ctpn.soluong;
    //         });
    //       }
    //     });

    //     //Phiếu nhập
    //     phieuxuat.map((px) => {
    //       if (parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i) {
    //         element.sophieuxuat++;
    //         px.ctpx.map((ctpx) => {
    //           element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
    //           vattuitem = listmaterialaverage.find((item) => {
    //             return item._id.toString() === ctpx.mavt.toString();
    //           });
    //           element.loinhuan += vattuitem.giatbxuat * ctpx.soluong;
    //         });
    //       }
    //     });

    //     statisticProfitYear.push({ ...element });
    //   }
    // }

    // console.log("element : ", element);
    //=========================
    //Nếu tất cả đại lý
    if (madailyfilter === "allstores") {
      for (var i = 1; i <= 12; i++) {
        element.thang = i;
        element.sophieunhap =
          element.sophieuxuat =
          element.chiphinhap =
          element.chiphixuat =
            0;
        //Phiếu nhập
        phieunhap.map((pn) => {
          if (parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i) {
            element.sophieunhap++;
            pn.ctpn.map((ctpn) => {
              element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
            });
          }
        });

        //Phiếu xuất
        phieuxuat.map((px) => {
          if (parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i) {
            element.sophieuxuat++;
            px.ctpx.map((ctpx) => {
              element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
            });
          }
        });
        statisticProfitYear.push({ ...element });
      }
    }
    //Chọn đại lý
    else {
      for (var i = 1; i <= 12; i++) {
        element.thang = i;
        element.sophieunhap =
          element.sophieuxuat =
          element.chiphinhap =
          element.chiphixuat =
            0;

        //Phiếu nhập
        phieunhap.map((pn) => {
          if (
            parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i &&
            pn.manv.madaily._id.toString() === madailyfilter
          ) {
            element.sophieunhap++;
            pn.ctpn.map((ctpn) => {
              element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
            });
          }
        });

        //Phiếu xuất
        phieuxuat.map((px) => {
          if (
            parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i &&
            px.manv.madaily._id.toString() === madailyfilter
          ) {
            element.sophieuxuat++;
            px.ctpx.map((ctpx) => {
              element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
            });
          }
        });
        statisticProfitYear.push({ ...element });
      }
    }

    return res.json(statisticProfitYear);
  },

  statisticProfitStage: async (req, res) => {
    //Lấy ra danh sách phiếu nhập theo tháng

    const { madailyfilter, startyearstatistic, endyearstatistic } = req.body;

    if (!madailyfilter) {
      return res.status(400).json({ message: "Vui lòng chọn đại lý" });
    }

    if (!startyearstatistic) {
      return res.status(400).json({ message: "Vui lòng chọn năm bắt đầu" });
    }

    if (!endyearstatistic) {
      return res.status(400).json({ message: "Vui lòng chọn năm bắt đầu" });
    }

    var statisticProfitYear = [];
    var element = {
      nam: 0,
      sophieunhap: 0,
      sophieuxuat: 0,
      chiphinhap: 0,
      chiphixuat: 0,
    };

    console.log("năm bắt đầu : ", startyearstatistic);
    console.log("năm két thúc: ", endyearstatistic);
    console.log("madailyfilter: ", madailyfilter);
    //    madailyfilter
    const phieunhap = await PhieuNhap.find({
      $expr: {
        $and: [
          { $gte: [{ $year: "$ngay" }, startyearstatistic] },
          { $lte: [{ $year: "$ngay" }, endyearstatistic] },
        ],
      },
    })
      .select({ ctpn: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });
    const phieuxuat = await PhieuXuat.find({
      $expr: {
        $and: [
          { $gte: [{ $year: "$ngay" }, startyearstatistic] },
          { $lte: [{ $year: "$ngay" }, endyearstatistic] },
        ],
      },
    })
      .select({ ctpx: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });

    // const phieunhap = await PhieuNhap.find({ $expr: { $eq: [{ $year: "$ngay" },yearstatistic] } }).select({ctpn : 1, ngay: 1, _id: 0}).populate('manv').populate({path :'manv',populate: {path: 'madaily'}});
    // const phieuxuat = await PhieuXuat.find({ $expr: [{ $eq: [{ $year: "$ngay" },yearstatistic] }] }).select({ctpx : 1, ngay: 1, _id: 0}).populate('manv').populate({path :'manv',populate: {path: 'madaily'}});

    for (var i = startyearstatistic; i <= endyearstatistic; i++) {
      element.nam = i;
      element.sophieunhap =
        element.sophieuxuat =
        element.chiphinhap =
        element.chiphixuat =
          0;

      //Phiếu nhập
      phieunhap.map((pn) => {
        // console.log('pn.ngay : ',(pn.ngay).slice(5,7))

        console.log("pn.ngay : ", JSON.stringify(pn.ngay).slice(1, 5));

        if (
          parseInt(JSON.stringify(pn.ngay).slice(1, 5)) === i &&
          pn.manv.madaily._id.toString() === madailyfilter
        ) {
          // console.log('pn.manv.madaily : ',pn.manv.madaily._id);
          // console.log('madailyfilter : ',madailyfilter);
          element.sophieunhap++;
          pn.ctpn.map((ctpn) => {
            element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
          });
        }
      });

      //Phiếu xuất
      phieuxuat.map((px) => {
        if (
          parseInt(JSON.stringify(px.ngay).slice(1, 5)) === i &&
          px.manv.madaily._id.toString() === madailyfilter
        ) {
          element.sophieuxuat++;
          px.ctpx.map((ctpx) => {
            element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
          });
        }
      });
      // console.log('element : ',element)
      statisticProfitYear.push({ ...element });
    }

    console.log("statisticProfitYear : ", statisticProfitYear);
    return res.json(statisticProfitYear);

    /*


            Bản Desktop
            Tháng 1 Số lượng nhập    Số lượng xuất   Tổng chi phí nhập   Tổng chi phí xuất   Tổng lợi nhuận
            Tháng 2 Số lượng nhập    Số lượng xuất   Tổng chi phí nhập   Tổng chi phí xuất   Tổng lợi nhuận
            Tháng 3 Số lượng nhập    Số lượng xuất   Tổng chi phí nhập   Tổng chi phí xuất   Tổng lợi nhuận
                                                                            Tổng lơi nhuận năm : 
            Bản mobile
            cột tháng 1-> 12
            Tháng 1
            Số lượng nhập Tổng chi phí nhập
            Số lượng xuất Tổng chi phí xuất
            Tổng lợi nhuận tháng

            Tháng 2
            Số lượng nhập Tổng chi phí nhập
            Số lượng xuất Tổng chi phí xuất
            Tổng lợi nhuận tháng
            ..
            ....
            ......
            Tổng lợi nhuận năm
            
            
            









           

            Tổng doanh thu đại lý hiện trên đầu
            - Trong mỗi bảng là một vật tư -> Cuối bảng là tổng doanh thu vật tư 12 tháng
            - Tạo mảng tháng, số lượng nhập, số lượng xuất gồm 12 phần tử
            - Lấy ra danh sách vật tư chỉ có trong đại lý

            Lọc phiếu nhập -> lọc map ct phiếu nhập
           
            -> Tạo ra mảng vật tư filter
             find danh sách mảng vật tư filter
            -> Nếu mà undefined (không có) -> Thêm vật tư đó vào trong mảng
            tăng số lượng nhập lên
            Biến doanh thu = - (số lượng nhập * giá nhập)   
            
            Lọc phiếu xuất -> Ọc map

        */

    // try {
    //     const {year,madailyfilter} = req.body;
    // } catch (error) {

    // }
  },

  statisticHomePage: async (req, res) => {
    try {
      const { madailyfilter } = req.body;
      if (!madailyfilter) {
        return res.status(400).json({ message: "Vui lòng chọn đại lý" });
      }

      const date = new Date();

      const countdaily = await DaiLy.countDocuments("_id");
      const countkho = await Kho.countDocuments("_id");
      const countnhanvien = await NhanVien.countDocuments("_id");

      // res.json({ statisticProfit, countdaily, countkho, countnhanvien });

      // const madailyfilter = "allstores";

      var statisticProfitYear = [];

      var element = {
        thang: "",
        sophieunhap: 0,
        sophieuxuat: 0,
        chiphinhap: 0,
        chiphixuat: 0,
      };

      const phieunhap = await PhieuNhap.find({
        $expr: { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
      })
        .select({ ctpn: 1, ngay: 1, _id: 0 })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } });
      const phieuxuat = await PhieuXuat.find({
        $expr: { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
      })
        .select({ ctpx: 1, ngay: 1, _id: 0 })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } });

      //Nếu tất cả đại lý
      if (madailyfilter === "allstores") {
        for (var i = 1; i <= 12; i++) {
          element.thang = i;
          element.sophieunhap =
            element.sophieuxuat =
            element.chiphinhap =
            element.chiphixuat =
              0;
          //Phiếu nhập

          phieunhap.map((pn) => {
            if (parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i) {
              element.sophieunhap++;
              pn.ctpn.map((ctpn) => {
                element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
              });
            }
          });

          //Phiếu xuất
          phieuxuat.map((px) => {
            if (parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i) {
              element.sophieuxuat++;
              px.ctpx.map((ctpx) => {
                element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
              });
            }
          });
          statisticProfitYear.push({ ...element });
        }
      }
      //Chọn đại lý
      else {
        for (var i = 1; i <= 12; i++) {
          element.thang = i;
          element.sophieunhap =
            element.sophieuxuat =
            element.chiphinhap =
            element.chiphixuat =
              0;

          //Phiếu nhập
          phieunhap.map((pn) => {
            if (
              parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i &&
              pn.manv.madaily._id.toString() === madailyfilter
            ) {
              element.sophieunhap++;
              pn.ctpn.map((ctpn) => {
                element.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
              });
            }
          });

          //Phiếu xuất
          phieuxuat.map((px) => {
            if (
              parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i &&
              px.manv.madaily._id.toString() === madailyfilter
            ) {
              element.sophieuxuat++;
              px.ctpx.map((ctpx) => {
                element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
              });
            }
          });
          statisticProfitYear.push({ ...element });
        }
      }

      return res.json({
        statisticProfitYear,
        countdaily,
        countkho,
        countnhanvien,
      });
      // res.json({ statisticProfit, countdaily, countkho, countnhanvien });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  statisticToday: async (req, res) => {
    try {
      var statisticStore = await DaiLy.find().select({ _id: 1, tendl: 1 });

      const date = new Date();
      let liststore = [];

      statisticStore.map((item) => {
        liststore.push({
          _id: item._id,
          tendl: item.tendl,
          sophieunhap: 0,
          chiphinhap: 0,
          sophieuxuat: 0,
          chiphixuat: 0,
        });
      });

      const phieunhaptoday = await PhieuNhap.find({
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$ngay" }, date.getDate()] },
            { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
            { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
          ],
        },
      })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } })
        .populate("makho")
        .populate("ctpn")
        .populate({ path: "ctpn", populate: { path: "mavt" } });

      const phieuxuattoday = await PhieuXuat.find({
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$ngay" }, date.getDate()] },
            { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
            { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
          ],
        },
      })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } })
        .populate("makho")
        .populate("ctpx")
        .populate({ path: "ctpx", populate: { path: "mavt" } });

      let finddaily = "";
      let sumbill = 0;

      phieunhaptoday.map((pn) => {
        finddaily = liststore.find((itemstore) => {
          if (pn.manv.madaily._id.toString() === itemstore._id.toString()) {
            pn.ctpn.map((ctpnitem) => {
              sumbill += ctpnitem.soluong * ctpnitem.gianhap;
            });
            itemstore.sophieunhap++;
            itemstore.chiphinhap += sumbill;
            sumbill = 0;
          }
          return pn.manv.madaily._id.toString() === itemstore._id.toString();
        });
      });

      phieuxuattoday.map((px) => {
        finddaily = liststore.find((itemstore) => {
          if (px.manv.madaily._id.toString() === itemstore._id.toString()) {
            pn.ctpn.map((ctpnitem) => {
              sumbill += ctpnitem.soluong * ctpnitem.gianhap;
            });
            itemstore.sophieuxuat++;
            itemstore.chiphixuat += sumbill;
            sumbill = 0;
          }
          return pn.manv.madaily._id.toString() === itemstore._id.toString();
        });
      });

      return res.json(liststore);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statisticCtrl;
