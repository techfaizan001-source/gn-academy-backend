// Yeh file student aur marks ka database schema define karti hai taaki har class ka data alag rahe.[cite: 33]
const mongoose = require('mongoose');

const marksheetSchema = new mongoose.Schema({
    className: { type: String, required: true }, // Class name (jaise PG, Nursery, LKG, UKG, 1st, etc.)[cite: 33]
    srNo: { type: String, required: true, unique: true }, // Scholar/SR Number[cite: 33]
    rollNo: { type: String },
    studentName: { type: String, required: true },
    fathersName: { type: String },
    mothersName: { type: String },
    dob: { type: String },
    address: { type: String },
    studentPhoto: { type: String }, // Student ki photo (Base64 string) save karne ke liye
    session: { type: String, default: '2025-26' }, //[cite: 33]
    marksData: { type: Object, default: {} }, // Subject-wise marks aur grades[cite: 33]
    gradesData: { type: Object, default: {} }, // Oral/Activity grades ke liye
    scholarRecord: { type: Object, default: {} }, // Attendance, Extra C.C. activities, etc.
    reportSummary: { type: Object, default: {} } // Percentage, Rank, Division, etc.[cite: 33]
}, { timestamps: true });

module.exports = mongoose.model('Marksheet', marksheetSchema);