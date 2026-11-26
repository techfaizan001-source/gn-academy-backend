// Yeh file marksheet ke liye CRUD operations (create, read, update, delete) ki API logic ko handle karti hai.
const Marksheet = require('./marksheetModel');

// Student register ya marks save karne ke liye
exports.saveOrUpdateMarksheet = async (req, res) => {
    try {
        const { srNo, className } = req.body;
        let student = await Marksheet.findOne({ srNo });
        if (student) {
            student = await Marksheet.findOneAndUpdate({ srNo }, req.body, { new: true });
            return res.status(200).json({ success: true, message: 'Student marksheet updated successfully!', student });
        }
        const newStudent = new Marksheet(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: 'Student registered & marksheet saved successfully!', student: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Class aur SR No. se student search karne ke liye
exports.getStudentMarksheet = async (req, res) => {
    try {
        const { className, srNo } = req.query;
        const student = await Marksheet.findOne({ className, srNo });
        if (!student) return res.status(404).json({ success: false, message: 'Student not found!' });
        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Database se saare saved students ki marksheet list fetch karne ke liye
exports.getAllMarksheets = async (req, res) => {
    try {
        const students = await Marksheet.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Student record delete karne ke liye
exports.deleteStudentMarksheet = async (req, res) => {
    try {
        await Marksheet.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Student marksheet deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};