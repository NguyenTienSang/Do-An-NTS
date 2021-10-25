// const router = require("express").Router();
const express = require('express');
const router = express.Router();
const warehouseCtrl = require("../controllers/warehouseCtrl");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
.route("/kho")
.get(warehouseCtrl.getAllWareHouse)
.post(warehouseCtrl.createWareHouse);

router
.route("/kho/:id")
.delete(auth,authAdmin,warehouseCtrl.deleteWareHouse)
.put(auth,authAdmin,warehouseCtrl.updateWareHouse);

module.exports = router;