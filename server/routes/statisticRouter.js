const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const statisticCtrl = require("../controllers/statisticCtrl");

router.route("/thongke/timkiemvattuphieunhap").post(statisticCtrl.searchMaterialImportBills)
router.route("/thongke/vattu").post(statisticCtrl.statisticMaterials);
router.route("/thongke/phieunhapnhanvien").post(statisticCtrl.statisticImportBillEmployees);
router.route("/thongke/loinhuannam").post(statisticCtrl.statisticProfitYear);



module.exports = router;