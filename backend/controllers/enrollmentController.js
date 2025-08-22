// controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const { StatusCodes } = require('http-status-codes');

const getCurrentUserEnrollments = async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user.userId })
        .populate({
            path: 'course',
            select: 'title description artForm artist'
        });
    res.status(StatusCodes.OK).json({ enrollments, count: enrollments.length });
};

module.exports = { getCurrentUserEnrollments };