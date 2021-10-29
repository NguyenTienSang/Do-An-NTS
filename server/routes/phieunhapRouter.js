const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const importbillCtrl = require("../controllers/importbillCtrl");

router
.route("/importbill")
.get(importbillCtrl.getImportBill)
.post(importbillCtrl.createImportBill);


router.route("/importbill/addbill").patch(importbillCtrl.addImportBill);

module.exports = router;