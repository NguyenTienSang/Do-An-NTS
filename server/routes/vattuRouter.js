const router = require("express").Router();
const materialCtrl = require("../controllers/materialCtrl");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
.route("/vattu")
.get(materialCtrl.getALLMaterial)
.post(auth,authAdmin,materialCtrl.createMaterial);

router
.route("/vattu/:id")
.get(materialCtrl.getMaterial)
.delete(materialCtrl.deleteMaterial)
.put(auth,authAdmin,materialCtrl.updateMaterial);

module.exports = router;