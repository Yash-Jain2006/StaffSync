const router = require("express").Router();
const c = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", c.apply);
router.get("/mine", c.mine);
router.get("/", authorize("HR", "Manager"), c.list);
router.patch("/:id/decision", authorize("HR", "Manager"), c.decide);

module.exports = router;
