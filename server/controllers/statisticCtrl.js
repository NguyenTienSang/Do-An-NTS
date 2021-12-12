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
    // res.json(vatti)
    // vattu.map(vattuitem => {
    //     vattuitem.soluong = 0;
    // })

    const { makhofilter } = req.body;

    // console.log('Mã đại lý thực hiện thống kê : ',madailyfilter)
    console.log("Mã kho thực hiện thống kê : ", makhofilter);

    //Tiến hành lấy danh sách vật tư đã có trong kho

    console.log("Chọn kho cụ thể");
    const listmaterialfilter = [];
    const phieunhap = await PhieuNhap.find()
      .populate("manv")
      .populate({ path: "ctpn", populate: { path: "mavt" } });
    const phieuxuat = await PhieuXuat.find()
      .populate("manv")
      .populate({ path: "ctpx", populate: { path: "mavt" } });
    console.log("PhieuNhap : ", phieunhap);
    console.log("PhieuXuat : ", phieuxuat);
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
    // } catch (error) {
    //     console.log('error.message: ',error.message);
    // }

    // console.log('filterpx : ',filterpx)

    // console.log('------------------------');
    // console.log('filterpn : ',filterpn);
    // console.log('filterpx : ',filterpx);
    //Lọc ra những vật tư có trong phiếu xuất
    filterpx?.map((px) => {
      px.ctpx?.map((ctpx) => {
        listmaterialfilter.find((listmaterialitem) => {
          // console.log(ctpx);
          // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
          // console.log('listmaterialitem._id : ',listmaterialitem._id);
          // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
          // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
          // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
          // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
          if (ctpx.mavt._id.toString() === listmaterialitem._id.toString()) {
            console.log("Vô nè");
            listmaterialitem.soluong -= ctpx.soluong;
          }
          return ctpx.mavt._id === listmaterialitem._id;
        });
      });
    });

    //Tiến hành gán vật tư có trong danh sách vật tư của kho thì lấy số lượng đó cho bằng số lượng vật tư tìm kiếm
    //Những vật  tư không có sẽ có giá trị là 0

    console.log("listmaterialfilter : ", listmaterialfilter);
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

    // if(madailyfilter === "allstores")
    // {
    //     console.log('Chọn toàn đại lý')
    //     const vattu = await VatTu.find();
    //     res.json(vattu)
    //     // console.log('listmaterialfilter : ',vattu);
    // }
    // else {
    //     if(makhofilter === "allwarehouses")
    //     {
    //         console.log('Chọn đại lý cụ thể')
    //         const listmaterialfilter = [];
    //         const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
    //         const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
    //         console.log('phieunhap : ',phieunhap);
    //         console.log('phieuxuat : ',phieuxuat);

    //         //Lấy danh sách phiếu nhập trong đại lý
    //         const filterpn = phieunhap.filter(pn => {
    //                 return madailyfilter == pn.manv.madaily;
    //         })

    //         const filterpx = phieuxuat.filter(px => {

    //                 return madailyfilter == px.manv.madaily;
    //         })
    //         console.log('filterpn : ',filterpn)
    //         //Lọc phiếu nhập
    //         filterpn?.map(pn => {
    //             pn.ctpn?.map(ctpn => {
    //                const timvattu =  listmaterialfilter.find(listmaterialitem => {
    //                             if(ctpn.mavt._id === listmaterialitem._id)
    //                             {
    //                                 console.log('---------- Tìm Thấy -----------')
    //                                 listmaterialitem.soluong+=ctpn.soluong;
    //                             }
    //                             return ctpn.mavt._id === listmaterialitem._id;
    //                 })

    //                 if(timvattu === undefined)
    //                 {
    //                     listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
    //                     // console.log('listmaterialfilter : ',listmaterialfilter)
    //                 }
    //             })
    //         })

    //         //Lọc phiếu xuất
    //         filterpx?.map(px => {
    //             px.ctpx?.map(ctpx => {
    //                listmaterialfilter.find(listmaterialitem => {
    //                             if(ctpx.mavt._id === listmaterialitem._id)
    //                             {
    //                                 listmaterialitem.soluong-=ctpx.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
    //                             }
    //                             return ctpx.mavt._id === listmaterialitem._id;
    //                 })
    //             })
    //         })
    //         console.log('listmaterialfilter : ',listmaterialfilter)
    //         res.json(listmaterialfilter)
    //     }
    //     else//Chọn đại lý, chọn kho cụ thể
    //     {
    //         console.log('Chọn kho cụ thể')
    //             const listmaterialfilter = [];
    //             const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
    //             const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
    //             console.log('PhieuNhap : ',phieunhap);
    //             console.log('PhieuXuat : ',phieuxuat);
    //             //Lọc phiếu nhập
    //             const filterpn = phieunhap?.filter(pn => {
    //                     return makhofilter == pn.makho;
    //             })

    //               //Lọc phiếu xuất
    //               const filterpx = phieuxuat?.filter(px => {
    //                 return makhofilter == px.makho;
    //         })

    //           console.log('filterpn : ',filterpn.length)

    //             // try {
    //                 filterpn?.map(pn => {
    //                     pn.ctpn?.map(ctpn => {
    //                        const timvattu =  listmaterialfilter.find(listmaterialitem => {
    //                                     if(ctpn.mavt._id === listmaterialitem._id)
    //                                     {
    //                                         listmaterialitem.soluong+=ctpn.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
    //                                     }
    //                                     return ctpn.mavt._id === listmaterialitem._id;
    //                         })

    //                         if(timvattu === undefined)
    //                         {
    //                             listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
    //                         }
    //                     })
    //                 })
    //             // } catch (error) {
    //             //     console.log('error.message: ',error.message);
    //             // }

    //         console.log('filterpx : ',filterpx)

    //         console.log('------------------------');
    //         // console.log('filterpn : ',filterpn);
    //         // console.log('filterpx : ',filterpx);
    //         filterpx?.map(px => {
    //             px.ctpx?.map(ctpx => {
    //                listmaterialfilter.find(listmaterialitem => {
    //                             // console.log(ctpx);
    //                             // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
    //                             // console.log('listmaterialitem._id : ',listmaterialitem._id);
    //                             // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
    //                             // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
    //                             // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
    //                             // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
    //                             if(ctpx.mavt._id.toString() === listmaterialitem._id.toString())
    //                             {
    //                                 console.log('Vô nè')
    //                                 listmaterialitem.soluong-=ctpx.soluong;
    //                             }
    //                             return ctpx.mavt._id === listmaterialitem._id;
    //                 })

    //             })
    //         })
    //             console.log('listmaterialfilter : ',listmaterialfilter)
    //             res.json(listmaterialfilter)
    //     }
    // }
  },

  statisticMaterials: async (req, res) => {
    //Chưa trừ số lượng xuất -> SAI (NHỚ BỔ SUNG)
    try {
      const { madailyfilter, makhofilter } = req.body;

      console.log("Mã đại lý thực hiện thống kê : ", madailyfilter);
      console.log("Mã kho thực hiện thống kê : ", makhofilter);
      if (madailyfilter === "allstores") {
        console.log("Chọn toàn đại lý");
        const vattu = await VatTu.find();
        return res.json(vattu);
      } else {
        if (makhofilter === "allwarehouses") {
          console.log("Chọn đại lý cụ thể và tất cả kho");
          const listmaterialfilter = [];
          const phieunhap = await PhieuNhap.find()
            .populate("manv")
            .populate({ path: "ctpn", populate: { path: "mavt" } });
          const phieuxuat = await PhieuXuat.find()
            .populate("manv")
            .populate({ path: "ctpx", populate: { path: "mavt" } });

          //Lấy danh sách phiếu nhập trong đại lý
          const filterpn = phieunhap.filter((pn) => {
            return madailyfilter == pn.manv.madaily;
          });

          const filterpx = phieuxuat.filter((px) => {
            return madailyfilter == px.manv.madaily;
          });

          //Lọc phiếu nhập
          filterpn?.map((pn) => {
            pn.ctpn?.map((ctpn) => {
              const timvattu = listmaterialfilter.find((listmaterialitem) => {
                if (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  console.log("---------- Tìm Thấy PN -----------");
                  listmaterialitem.soluong += ctpn.soluong;
                }
                return (
                  ctpn.mavt._id.toString() === listmaterialitem._id.toString()
                );
              });
              console.log("timvattu : ", timvattu);
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
            console.log("px : ", px);
            px.ctpx?.map((ctpx) => {
              listmaterialfilter.find((listmaterialitem) => {
                if (
                  ctpx.mavt._id.toString() ===
                  listmaterialitem._id._id.toString()
                ) {
                  console.log("Tìm thấy vật tư trong phiếu xuất");
                  listmaterialitem.soluong -= ctpx.soluong; //Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                }
                return (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                );
              });
            });
          });
          res.json(listmaterialfilter);
        } //Chọn đại lý, chọn kho cụ thể
        else {
          console.log("Chọn kho cụ thể");
          const listmaterialfilter = [];
          const phieunhap = await PhieuNhap.find()
            .populate("manv")
            .populate({ path: "ctpn", populate: { path: "mavt" } });
          const phieuxuat = await PhieuXuat.find()
            .populate("manv")
            .populate({ path: "ctpx", populate: { path: "mavt" } });
          console.log("PhieuNhap : ", phieunhap);
          console.log("PhieuXuat : ", phieuxuat);
          //Lọc phiếu nhập
          const filterpn = phieunhap?.filter((pn) => {
            return makhofilter == pn.makho;
          });

          //Lọc phiếu xuất
          const filterpx = phieuxuat?.filter((px) => {
            return makhofilter == px.makho;
          });

          console.log("filterpn : ", filterpn.length);

          // try {
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
                // console.log(ctpx);
                // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
                // console.log('listmaterialitem._id : ',listmaterialitem._id);
                // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
                // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
                // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
                // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
                if (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                ) {
                  console.log("Vô nè");
                  listmaterialitem.soluong -= ctpx.soluong;
                }
                return (
                  ctpx.mavt._id.toString() === listmaterialitem._id.toString()
                );
              });
            });
          });
          console.log("listmaterialfilter : ", listmaterialfilter);
          res.json(listmaterialfilter);
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Thống kê thất bại" });
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
        // const phieunhap = await PhieuNhap.find({"manv" : manv, "ngay":{$gte:startDateFilter,$lt:endDateFilter}})

        console.log("phieunhap : ", phieunhap);

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
        console.log("phieuxuat : ", phieuxuat);

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

      console.log("manv : ", manv);
      console.log("day : ", date.getDate());
      console.log("month : ", date.getMonth() + 1);
      console.log("year : ", date.getFullYear());

      //    const phieunhapday = await PhieuNhap.find({ $expr:  { $and: [ { $eq: [{ $dayOfMonth: "$ngay" },3] }, { $eq: [{ $month: "$ngay" },date.getMonth+1] }, { $eq: [{ $year: "$ngay" },date.getFullYear()] }]   }  }).select({ctpn : 1, ngay: 1, _id: 0})

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

      //   console.log("statisticProfit : ", statisticProfit);

      return res.json({ statisticProfit });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //Thống kê lợi nhuận năm
  statisticProfitYear: async (req, res) => {
    //Lấy ra danh sách phiếu nhập theo tháng

    const { madailyfilter, yearstatistic } = req.body;

    // console.log('test')
    console.log("madailyfilter : ", madailyfilter);
    console.log("yearstatistic : ", yearstatistic);
    console.log("typeof(yearstatistic) 1 : ", typeof yearstatistic);
    // const test = parseInt(yearstatistic);
    // console.log('typeof(yearstatistic) 2 : ',typeof(test));
    // console.log('test : ',test);

    if (!madailyfilter) {
      return res.status(400).json({ message: "Vui lòng chọn đại lý" });
    }

    if (!yearstatistic) {
      return res.status(400).json({ message: "Vui lòng chọn năm" });
    }

    var statisticProfitYear = [];
    var element = {
      thang: "",
      sophieunhap: 0,
      sophieuxuat: 0,
      chiphinhap: 0,
      chiphixuat: 0,
    };

    // phieunhap = await PhieuNhap.find({ $expr: { $and: [{ $eq: [{ $month: "$ngay" },11] }, { $eq: [{ $year: "$ngay" },nam] }] } }).select({ctpn : 1, ngay: 1, _id: 0})
    // phieunhap = await PhieuNhap.find({ $expr: { $and: [{ $eq: [{ $month: "$ngay" },11] }, { $eq: [{ $year: "$ngay" },nam] }] } }).select({ctpn : 1, ngay: 1, _id: 0})

    const phieunhap = await PhieuNhap.find({
      $expr: { $eq: [{ $year: "$ngay" }, yearstatistic] },
    })
      .select({ ctpn: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });
    const phieuxuat = await PhieuXuat.find({
      $expr: { $eq: [{ $year: "$ngay" }, yearstatistic] },
    })
      .select({ ctpx: 1, ngay: 1, _id: 0 })
      .populate("manv")
      .populate({ path: "manv", populate: { path: "madaily" } });
    // const phieuxuat = await PhieuXuat.find({ $expr: { $and: [{ $eq: [{ $month: "$ngay" },11] }, { $eq: [{ $year: "$ngay" },nam] }] } }).select({ctpx : 1, ngay: 1, _id: 0});

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
          // console.log('pn.ngay : ',(pn.ngay).slice(5,7))

          // console.log('pn.ngay : ',(JSON.stringify(pn.ngay)).slice(6,8))

          if (parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i) {
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
          if (parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i) {
            element.sophieuxuat++;
            px.ctpx.map((ctpx) => {
              element.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
            });
          }
        });
        // console.log('element : ',element)
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
          // console.log('pn.ngay : ',(pn.ngay).slice(5,7))

          // console.log('pn.ngay : ',(JSON.stringify(pn.ngay)).slice(6,8))

          if (
            parseInt(JSON.stringify(pn.ngay).slice(6, 8)) === i &&
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
            parseInt(JSON.stringify(px.ngay).slice(6, 8)) === i &&
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
    }

    console.log("statisticProfitYear : ", statisticProfitYear);
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
      const date = new Date();

      var statisticProfit = {
        sophieunhap: 0,
        sophieuxuat: 0,
        chiphinhap: 0,
        chiphixuat: 0,
      };

      const phieunhap = await PhieuNhap.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
            { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
          ],
        },
      }).select({ ctpn: 1, ngay: 1, _id: 0 });
      const phieuxuat = await PhieuXuat.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$ngay" }, date.getMonth() + 1] },
            { $eq: [{ $year: "$ngay" }, date.getFullYear()] },
          ],
        },
      }).select({ ctpx: 1, ngay: 1, _id: 0 });

      //Phiếu nhập
      phieunhap.forEach((pn) => {
        statisticProfit.sophieunhap++;
        pn.ctpn.forEach((ctpn) => {
          statisticProfit.chiphinhap += parseInt(ctpn.gianhap * ctpn.soluong);
        });
      });

      //Phiếu xuất
      phieuxuat.forEach((px) => {
        statisticProfit.sophieuxuat++;
        px.ctpx.forEach((ctpx) => {
          statisticProfit.chiphixuat += parseInt(ctpx.giaxuat * ctpx.soluong);
        });
      });

      const countdaily = await DaiLy.countDocuments("_id");
      const countkho = await Kho.countDocuments("_id");
      const countnhanvien = await NhanVien.countDocuments("_id");

      res.json({ statisticProfit, countdaily, countkho, countnhanvien });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statisticCtrl;
