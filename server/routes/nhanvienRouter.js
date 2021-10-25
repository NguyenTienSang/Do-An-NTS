// const router = require("express").Router();
const express = require('express');
const router = express.Router();
const employeeCtrl = require("../controllers/employeeCtrl");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
.route("/nhanvien")
.get(employeeCtrl.getAllEmployee);

router
.route("/nhanvien/:id")
.delete(auth,authAdmin,employeeCtrl.deleteEmployee)
.put(auth,authAdmin,employeeCtrl.updateEmployee);

module.exports = router;