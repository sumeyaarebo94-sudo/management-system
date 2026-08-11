const express = require("express");

const {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getAttendance);
router.get("/:id", getAttendanceById);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);

module.exports = router;