const Attendance = require("../models/Attendance");

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("member", "name email division year")
      .populate("markedBy", "name email role")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("member", "name email division year")
      .populate("markedBy", "name email role");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { member, date, status } = req.body;

    const attendance = await Attendance.create({
      member,
      date,
      status,
      markedBy: req.user.id,
    });

    const populatedAttendance = await attendance.populate([
      {
        path: "member",
        select: "name email division year",
      },
      {
        path: "markedBy",
        select: "name email role",
      },
    ]);

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already exists for this member on this date",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { status, date, member } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        date,
        member,
        markedBy: req.user.id,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("member", "name email division year")
      .populate("markedBy", "name email role");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already exists for this member on this date",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
};