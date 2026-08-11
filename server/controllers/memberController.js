const Member = require("../models/Member");

const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, email, division, year } = req.body;

    const member = await Member.create({
      name,
      email,
      division,
      year,
    });

    res.status(201).json({
      message: "Member created successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateMember = async (req, res) => {
  try {
    const { name, email, division, year } = req.body;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        division,
        year,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};