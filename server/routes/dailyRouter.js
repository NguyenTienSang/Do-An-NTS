const router = require('express').Router();
const storeCtrl = require("../controllers/storeCtrl");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
.route("/daily/")
.get(storeCtrl.getALLStore)
.post(storeCtrl.createStore);

router
.route("/daily/:id")
.get(storeCtrl.getStore)
.delete(storeCtrl.deleteStore)
.put(auth,authAdmin,storeCtrl.updateStore);

module.exports = router;

