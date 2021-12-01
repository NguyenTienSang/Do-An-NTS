const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const statisticCtrl = require("../controllers/statisticCtrl");

router.route("/thongke/timkiemvattuphieunhap").post(statisticCtrl.searchMaterialImportBills)
router.route("/thongke/vattu").post(statisticCtrl.statisticMaterials);
router.route("/thongke/phieunhapnhanvien").post(statisticCtrl.statisticImportBillEmployees);
router.route("/thongke/loinhuannam").post(statisticCtrl.statisticProfitYear);//Thống kê lợi nhuận năm
router.route("/thongke/loinhuangiaidoan").post(statisticCtrl.statisticProfitStage);//Thống kê lợi nhuận giai đoạn



module.exports = router;