const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const exportbillCtrl = require("../controllers/exportbillCtrl");

router
.route("/phieuxuat")
.get(exportbillCtrl.getExportBill)
.post(exportbillCtrl.createExportBill);


module.exports = router;