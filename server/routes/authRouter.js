const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const auth = require("../middleware/auth");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.get("/logout", authCtrl.logout);

router.get("/refresh_token", authCtrl.refreshToken);

router.get("/infor", auth, authCtrl.getEmployee);


module.exports = router;