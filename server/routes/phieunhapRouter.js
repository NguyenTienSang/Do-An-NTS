const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const importbillCtrl = require("../controllers/importbillCtrl");

router
.route("/phieunhap")
.get(importbillCtrl.getImportBill)
.post(importbillCtrl.createImportBill);


// router.route("/exportbill/addbill").patch(exportbillCtrl.addExportBill);

module.exports = router;