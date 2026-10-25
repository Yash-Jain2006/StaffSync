const router = require("express").Router();
const c = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/me", c.getMe);
router.patch("/me", c.updateMe);
router.get("/managers", authorize("HR"), c.managers);
router.get("/", authorize("HR", "Manager"), c.list);
router.post("/", authorize("HR"), c.create);
router.patch("/:id", authorize("HR"), c.update);
router.delete("/:id", authorize("HR"), c.remove);

module.exports = router;
