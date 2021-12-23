const VatTu = require("../models/VatTu");
const PhieuNhap = require("../models/PhieuNhap");

const importbillCtrl = {
  getImportBill: async (req, res) => {
    try {
      const phieunhap = await PhieuNhap.find()
        .sort({ ngay: -1 })
        .populate("manv")
        .populate({ path: "manv", populate: { path: "madaily" } })
        .populate("makho")
        .populate("ctpn")
        .populate({ path: "ctpn", populate: { path: "mavt" } });

      console.log("phieunhap : ", phieunhap);

      return res.json(phieunhap);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lập phiếu nhập thất bại" });
    }
  },
  createImportBill: async (req, res) => {
    const { ngay, manv, makho, hotenkh, sodienthoaikh, ctpn } = req.body;
    if (!ngay) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày không được trống" });
    }
    if (!manv) {
      return res
        .status(400)
        .json({ success: false, message: "Mã nhân viên không được trống" });
    }
    if (!makho) {
      return res
        .status(400)
        .json({ success: false, message: "Mã kho không được trống" });
    }
    if (!hotenkh) {
      return res.status(400).json({
        success: false,
        message: "Họ tên khách hàng không được trống",
      });
    }
    if (!sodienthoaikh) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại khách hàng không được trống",
      });
    }
    console.log("ctpn : ", ctpn[0]);
    if (!ctpn) {
      return res
        .status(400)
        .json({ success: false, message: "Phiếu nhập chưa có vật tư" });
    }

    // console.log('tenpn : ',tenpn);
    console.log("ngay : ", ngay);
    console.log("manv : ", manv);
    console.log("kho : ", makho);
    try {
      // const phieunhap = await PhieuNhap.findOne({ tenpn })

      // if (phieunhap)
      // {
      //     return res
      //     .status(400)
      //     .json({ success: false, message: 'Tên phiếu nhập đã tồn tại' })
      // }
      const newPhieuNhap = new PhieuNhap({
        ngay,
        manv,
        makho,
        hotenkh,
        sodienthoaikh,
        ctpn,
      });
      await newPhieuNhap.save();

      const vattu = await VatTu.find();

      ctpn?.map(async (ctpnitem) => {
        const soluongvt = await VatTu.findById(ctpnitem.mavt.toString(), {
          soluong: 1,
          _id: 0,
        });

        await VatTu.findOneAndUpdate(
          { _id: ctpnitem.mavt.toString() },
          { soluong: soluongvt.soluong + ctpnitem.soluong },
          { new: true }
        );

        //  vattu?.map(async vt => {
        //     if(vt._id.toString() === ctpnitem.mavt)
        //     {
        //         vt.soluong += ctpnitem.soluong;
        //         await VatTu.findOneAndUpdate({ _id: (vt._id).toString() },vt, {new:true});
        //     }
        // });
      });
      // console.log('vt new : ',vattu);
      // VatTu.update(filter,{vattu})

      return res.json({
        message: "Lập phiếu thành công",
        newPhieuNhap,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Lập phiếu nhập thất bại" });
    }
  },
  addImportBill: async (req, res) => {
    try {
      const pn = await PhieuNhap.findById(req.params.id);
      if (!pn)
        return res.status(400).json({ message: "Phiếu nhập không tồn tại" });

      await PhieuNhap.findOneAndUpdate(
        { _id: req.params.id },
        {
          ctpn: req.body.ctpn,
        }
      );
      return res.json({ message: "Đã thêm vào phiếu nhập" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = importbillCtrl;
