const router = require("express").Router();
const c = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", c.list);
router.post("/", authorize("HR"), c.create);
router.patch("/:id", authorize("HR"), c.update);
router.delete("/:id", authorize("HR"), c.remove);

module.exports = router;
