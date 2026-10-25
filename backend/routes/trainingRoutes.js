const router = require("express").Router();
const c = require("../controllers/trainingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", c.list);
router.post("/", authorize("HR", "Manager"), c.create);
router.patch("/:id", authorize("HR", "Manager"), c.update);
router.delete("/:id", authorize("HR", "Manager"), c.remove);

module.exports = router;
