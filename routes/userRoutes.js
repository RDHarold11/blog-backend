const Router = require("express");
const router = Router();

const {
  registerUser,
  loginUser,
  prueba,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
