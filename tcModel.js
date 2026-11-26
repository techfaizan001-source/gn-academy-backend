const mongoose = require('mongoose');

const tcSchema = new mongoose.Schema({
  scholarsName: { type: String, required: true },
  mothersName: { type: String },
  fathersName: { type: String },
  occupationMobile: { type: String },
  guardiansName: { type: String },
  dobFigure: { type: String },
  dobWords: { type: String },
  scholarsBehaviour: { type: String },
  resident: { type: String },
  nationality: { type: String },
  religionCategory: { type: String },
  firstAdmissionDateClass: { type: String },
  registrationNo: { type: String },
  classLastStudied: { type: String },
  schoolExamResult: { type: String },
  subjectsLastClass: { type: String },
  paidSchoolDuesSession: { type: String },
  dateOfApplication: { type: String },
  dateStruckOff: { type: String },
  dateOfIssue: { type: String },
  reasonForLeaving: { type: String },
  serialNo: { type: String },
  schoolRegNo: { type: String },
  udiseNo: { type: String },
  schoolEmail: { type: String },
  bookNo: { type: String }
}, { timestamps: true, collection: 'Student_Data_Tc' });

module.exports = mongoose.model('Student_Data_Tc', tcSchema);