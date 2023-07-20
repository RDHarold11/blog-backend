const Router = require("express");
const router = Router();

const multer = require("multer");
const uploadMiddleware = multer({ dest: "img/" });

const {
  createArticle,
  getArticles,
  deleteArticles,
  updateArticles,
  getAllArticles,
  getArticleById,
  getPostsByUser,
  lastArticle,
} = require("../controllers/articleControllers");
const protect = require("../middleware/authMiddleware");

/* Rutas protegidas */
router.route("/").post(protect, createArticle).get(protect, getArticles);
router
  .route("/:id")
  .delete(protect, deleteArticles)
  .put(protect, updateArticles);

/* Rutas publicas */
router.get("/getArticles/", getAllArticles);
router.get("/articleId/:id", getArticleById);
router.get("/user/:name", getPostsByUser);
router.get("/lastArticle", lastArticle);
/* Me falta filtrar el ultimo registro */
module.exports = router;
