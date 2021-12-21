const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const statisticCtrl = require("../controllers/statisticCtrl");

router
  .route("/thongke/timkiemvattuphieunhap")
  .post(statisticCtrl.searchMaterialImportBills);
router.route("/thongke/vattu").post(statisticCtrl.statisticMaterials);
router
  .route("/thongke/vattutrongcacdaily")
  .post(statisticCtrl.statisticMaterialsInListWareHouse);
router
  .route("/thongke/phieunhapnhanvien")
  .post(statisticCtrl.statisticImportBillEmployees);

router.route("/thongke/loinhuannam").post(statisticCtrl.statisticProfitYear); //Thống kê lợi nhuận năm
router
  .route("/thongke/thongkedoanhthu")
  .post(statisticCtrl.statisticTurnOverTime); //Thống kê lợi nhuận năm

router
  .route("/thongke/loinhuangiaidoan")
  .post(statisticCtrl.statisticProfitStage); //Thống kê lợi nhuận giai đoạn
router.route("/thongke/trangchu").post(statisticCtrl.statisticHomePage); //Thống kê ở trang chủ

router.route("/thongke/dulieuhomnay").get(statisticCtrl.statisticToday); //Thống kê ở trang chủ

router
  .route("/thongke/phieunhanvien")
  .post(statisticCtrl.statisticBillEmployees); //Thống kê phiếu nhân viên

module.exports = router;
