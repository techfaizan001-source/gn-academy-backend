const express = require('express');
// Yeh mongoose library MongoDB database se connect karne aur models banane ke liye hai.
const mongoose = require('mongoose');
// Yeh cors middleware frontend aur backend ke beech cross-origin requests allow karta hai.
const cors = require('cors');
// Yeh nodemailer library email bhejne ke liye use hoti hai.
const nodemailer = require('nodemailer'); 
// Yeh custom date aur time module current date/time fetch karne ke liye hai.
const dateTimeModule = require('./Date_And_Time');

// ye tc routes import karta hai.
const tcRoutes = require('./tcRoutes');

// Yeh express application instance banata hai.
const app = express();

// Yeh JSON data ki limit 50mb set karta hai badi files/images ke liye.
app.use(express.json({ limit: '50mb' })); 
// Yeh URL encoded data ko parse karne ke liye hai 50mb limit ke sath.
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Yeh saari incoming cross-origin requests ko allow karta hai.
app.use(cors());
// Yeh admission documents upload folder ko static serve karta hai.
app.use('/uploads', express.static('Admission_Documents_Upload'));
app.use('/api/tc', tcRoutes);

// Yeh MongoDB database 'school_db' se local connection establish karta hai.
mongoose.connect('mongodb+srv://techfaizan001_db_user:YIFouuqiQg7svzhS@cluster0.jlxbung.mongodb.net/gn_academy?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected to Atlas!'))
  .catch((err) => console.error('Database Connection Error:', err));

// Yeh Gmail service ke sath mail transporter configure karta hai.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'faizankhan160118@gmail.com',
    pass: 'aebkjzvkfddhmsml'
  }
});

// Yeh notices ke liye database schema define karta hai.
const noticeSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String
});
// Yeh Notice model register karta hai.
const Notice = mongoose.model('Notice', noticeSchema);

// Yeh admission inquiries ke liye database schema define karta hai.
const inquirySchema = new mongoose.Schema({
  studentName: String,
  parentPhone: String,
  classApply: String,
  message: String,
  date: { type: Date, default: Date.now }
});
// Yeh Inquiry model register karta hai.
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Yeh contact form messages ke liye database schema define karta hai.
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date }
});
// Yeh Contact model register karta hai.
const Contact = mongoose.model('Contact', contactSchema);

// Yeh student admissions ke liye database schema define karta hai.
const admissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  className: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  document: { type: String },
  submittedAt: { type: Date }, 
  createdAt: { type: Date, default: Date.now }
});
// Yeh Admission model register karta hai.
const Admission = mongoose.model('Admission', admissionSchema);

// Yeh fee structure PDFs ke liye database schema define karta hai.
const feeStructureSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  pdfPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
// Yeh FeeStructure model register karta hai.
const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

// ================= UPDATED STUDENT RECORD SCHEMA =================
const studentRecordSchema = new mongoose.Schema({
  srNo: { type: String, required: true },
  rollNo: { type: String },
  receiptNo: { type: String },
  bookNo: { type: String },
  className: { type: String },
  studentName: { type: String, required: true },
  fatherName: { type: String },
  fathersName: { type: String },
  mothersName: { type: String },
  dob: { type: String },
  address: { type: String },
  phone: { type: String },
  studentPhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'receipt_student_record' });

const StudentRecord = mongoose.model('StudentRecord', studentRecordSchema);
// =================================================================

// ================= MARKSHEET SCHEMA (marksheets_student_record) =================
const marksheetSchema = new mongoose.Schema({
  srNo: String,
  rollNo: String,
  studentName: String,
  fathersName: String,
  mothersName: String,
  dob: String,
  address: String,
  studentPhoto: String,
  className: String,
  marksData: Object,
  gradesData: Object,
  scholarRecord: Object,
  reportData: Object,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'marksheets_student_record' });

const Marksheet = mongoose.model('Marksheet', marksheetSchema);
// =========================================================================================

// ================= MARKSHEET NO DATA SCHEMA =================
const marksheetNoDataSchema = new mongoose.Schema({
  srNo: String,
  rollNo: String,
  studentName: String,
  fathersName: String,
  mothersName: String,
  dob: String,
  address: String,
  studentPhoto: String,
  className: String,
  marksData: Object,
  gradesData: Object,
  scholarRecord: Object,
  reportData: Object,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'marksheet_no_data' });

const MarksheetNoData = mongoose.model('MarksheetNoData', marksheetNoDataSchema);

// Get All Records
app.get('/api/marksheet_no_data', async (req, res) => {
  try {
    const list = await MarksheetNoData.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Data fetch nahi ho paya' });
  }
});

// Save or Update Record
app.post('/api/marksheet_no_data/save', async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    
    // Agar _id diya hai toh findByIdAndUpdate with upsert use karein
    if (_id && _id !== '') {
      const updated = await MarksheetNoData.findByIdAndUpdate(
        _id, 
        data, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, data: updated, message: 'Record successfully update ho gaya!' });
    }
    
    // Agar _id nahi hai toh srNo ke base par upsert karein taaki duplicate na bane
    if (data.srNo) {
      const updatedBySr = await MarksheetNoData.findOneAndUpdate(
        { srNo: data.srNo },
        data,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, data: updatedBySr, message: 'Record successfully save ho gaya!' });
    }

    const newItem = new MarksheetNoData(data);
    await newItem.save();
    res.json({ success: true, data: newItem, message: 'Record successfully save ho gaya!' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Single Record
app.delete('/api/marksheet_no_data/delete/:id', async (req, res) => {
  try {
    await MarksheetNoData.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete nahi ho paya' });
  }
});

// Delete All Records
app.delete('/api/marksheet_no_data/delete-all', async (req, res) => {
  try {
    await MarksheetNoData.deleteMany({});
    res.json({ success: true, message: 'Sabhi records successfully delete ho gaye!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete all nahi ho paya' });
  }
});

// Yeh fee history records ke liye database schema define karta hai.
const feeHistorySchema = new mongoose.Schema({
  srNo: { type: String, required: true },
  receiptNo: { type: String },
  editDate: { type: String, required: true },
  editMonth: { type: String, required: true },
  feeAmount: { type: Number, required: true },
  dueDetails: { type: String, default: 'None' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'feehistories' });
const FeeHistory = mongoose.model('FeeHistory', feeHistorySchema);

// Yeh popup notices ke liye database schema define karta hai.
const popupSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  title: { type: String, default: 'IMPORTANT NOTICE' },
  message: { type: String, default: '' },
  image: { type: String, default: '' }
});
const Popup = mongoose.model('Popup', popupSchema);

// ================= CERTIFICATE SCHEMA & APIS =================
const certificateSchema = new mongoose.Schema({
  schoolName: String,
  studentName: String,
  fatherName: String,
  studentClass: String,
  achievement: String,
  certDate: String,
  address: String,
  phoneNo: String,
  certificateImage: String, 
  positions: Object,
  styles: Object,
  visibility: Object,
  createdAt: { type: Date, default: Date.now }
});
const Certificate = mongoose.model('Certificate', certificateSchema);

app.get('/api/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: 'Certificates fetch nahi ho paye' });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const newCert = new Certificate(req.body);
    await newCert.save();
    res.status(201).json({ success: true, message: 'Certificate successfully save ho gaya!' });
  } catch (err) {
    console.error('Certificate save error:', err);
    res.status(500).json({ success: false, error: 'Certificate save nahi ho paya' });
  }
});

app.put('/api/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true } 
    );

    if (!updatedCertificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    res.status(200).json({ success: true, message: 'Certificate updated successfully!', data: updatedCertificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, message: 'Failed to update certificate.', error: error.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const deletedCert = await Certificate.findByIdAndDelete(req.params.id);
    if (!deletedCert) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }
    res.json({ success: true, message: 'Certificate successfully delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete nahi ho paya' });
  }
});
// =============================================================

// ================= MARKSHEET DIRECT API HANDLING =================
app.get('/api/marksheet/get-all', async (req, res) => {
  try {
    const students = await Marksheet.find().sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Marksheet records fetch nahi ho paye' });
  }
});

app.post('/api/marksheet/save', async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    if (_id && _id !== '') {
      const updated = await Marksheet.findByIdAndUpdate(
        _id, 
        data, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, student: updated });
    }
    const newMarksheet = new Marksheet(data);
    await newMarksheet.save();
    res.json({ success: true, student: newMarksheet });
  } catch (err) {
    console.error('Marksheet save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/marksheet/delete/:id', async (req, res) => {
  try {
    const studentToDelete = await Marksheet.findById(req.params.id);
    
    if (studentToDelete && studentToDelete.srNo) {
      await MarksheetNoData.deleteMany({ srNo: studentToDelete.srNo });
    }

    await Marksheet.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Student aur uski marksheet dono successfully delete ho gayi!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Marksheet delete nahi ho payi' });
  }
});

// Multer storage configuration
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Admission_Documents_Upload/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Other APIs
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Notices fetch nahi ho paye' });
  }
});

app.post('/api/inquiry', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: 'Admission Inquiry successfully send ho gayi!' });
  } catch (err) {
    res.status(500).json({ error: 'Inquiry send nahi ho payi' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newContact = new Contact({ name, email, phone, subject, message, createdAt: dateTimeModule.myDateTime() });
    await newContact.save();

    if (email) {
      const mailOptions = {
        from: 'faizankhan160118@gmail.com',
        to: email,
        subject: 'Message Received - Ghareeb Nawaz Academy',
        text: `Hello ${name},\n\nThank you for contacting Ghareeb Nawaz Academy. We have received your message and will get back to you soon.\n\nBest Regards,\nGhareeb Nawaz Academy\nFatehpur, UP`
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.log('Contact Email Error:', err);
      });
    }
    res.status(201).json({ success: true, message: 'Sandesh safalpurvak bhej diya gaya hai!' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ success: false, error: 'Sandesh save nahi ho paya' });
  }
});

app.get('/api/admissions', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    console.error('Error fetching admissions:', err);
    res.status(500).json({ error: 'Admissions data fetch nahi ho paya' });
  }
});

app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);
    if (!deletedAdmission) return res.status(404).json({ error: 'Admission record nahi mila' });
    res.json({ message: 'Admission successfully delete ho gaya!' });
  } catch (err) {
    console.error('Error deleting admission:', err);
    res.status(500).json({ error: 'Server error ki wajah se delete nahi ho paya' });
  }
});

app.post('/api/admission', upload.single('document'), async (req, res) => {
  try {
    const admissionData = { ...req.body, document: req.file ? req.file.filename : '', submittedAt: dateTimeModule.myDateTime() };
    const newAdmission = new Admission(admissionData);
    await newAdmission.save();

    if (req.body.email) {
      const mailOptions = {
        from: 'faizankhan160118@gmail.com',
        to: req.body.email,
        subject: 'Admission Application Received - Ghareeb Nawaz Academy',
        text: `Hello ${req.body.studentName},\n\nThank you for applying to Ghareeb Nawaz Academy for Class ${req.body.className}. We have successfully received your admission application.\n\nOur team will contact you soon!\n\nBest Regards,\nGhareeb Nawaz Academy\nFatehpur, UP`
      };
      transporter.sendMail(mailOptions, (error, info) => { if (error) console.log('Email error:', error); });
    }
    res.status(201).json({ success: true, message: 'Admission form successfully submit ho gaya hai!' });
  } catch (err) {
    console.error('Error saving admission:', err);
    res.status(500).json({ success: false, error: 'Admission form save nahi ho paya' });
  }
});

app.post('/api/fees/upload', upload.single('feePdf'), async (req, res) => {
  try {
    const { className } = req.body;
    const pdfFileName = req.file ? req.file.filename : '';
    if (!className || !pdfFileName) return res.status(400).json({ success: false, error: 'Class name aur PDF file dono zaroori hain!' });

    let feeRecord = await FeeStructure.findOne({ className });
    if (feeRecord) {
      feeRecord.pdfPath = pdfFileName;
      await feeRecord.save();
    } else {
      feeRecord = new FeeStructure({ className, pdfPath: pdfFileName });
      await feeRecord.save();
    }
    res.status(201).json({ success: true, message: 'Fee structure PDF successfully upload ho gayi hai!' });
  } catch (err) {
    console.error('Error uploading fee structure:', err);
    res.status(500).json({ success: false, error: 'Fee structure upload nahi ho paya' });
  }
});

app.get('/api/fees', async (req, res) => {
  try {
    const fees = await FeeStructure.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    console.error('Error fetching fees:', err);
    res.status(500).json({ error: 'Fee structures fetch nahi ho paye' });
  }
});

app.delete('/api/fees/:id', async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee structure successfully delete ho gaya!' });
  } catch (err) {
    console.error('Error deleting fee structure:', err);
    res.status(500).json({ error: 'Delete nahi ho paya' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await StudentRecord.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Students fetch nahi ho paye' });
  }
});

app.get('/api/students/search/:srNo', async (req, res) => {
  try {
    const cleanSrNo = String(req.params.srNo).trim();
    const student = await StudentRecord.findOne({ srNo: cleanSrNo });
    if (!student) return res.status(404).json({ success: false, error: 'Yeh Sr No. database mein nahi mila!' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error ki wajah se search nahi ho paya' });
  }
});

app.get('/api/students/:srNo', async (req, res) => {
  try {
    const cleanSrNo = String(req.params.srNo).trim();
    const student = await StudentRecord.findOne({ srNo: cleanSrNo });
    if (!student) return res.status(404).json({ success: false, error: 'Student nahi mila' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const cleanData = { ...req.body, srNo: String(req.body.srNo).trim() };
    const newStudent = new StudentRecord(cleanData);
    await newStudent.save();
    res.status(201).json({ success: true, message: 'Student successfully database me save ho gaya!' });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Student save nahi ho paya.' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await StudentRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ success: false, error: 'Student record nahi mila' });
    res.json({ success: true, message: 'Student record successfully update ho gaya!', updatedStudent });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update nahi ho paya' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await StudentRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student record successfully delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ error: 'Delete nahi ho paya' });
  }
});

app.get('/api/fee-history/:srNo', async (req, res) => {
  try {
    const cleanSrNo = String(req.params.srNo).trim();
    const historyList = await FeeHistory.find({ srNo: cleanSrNo }).sort({ createdAt: -1 });
    res.json(historyList);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Fee history fetch nahi ho payi' });
  }
});

app.post('/api/fee-history', async (req, res) => {
  try {
    const newFeeRecord = new FeeHistory(req.body);
    await newFeeRecord.save();
    res.status(201).json({ success: true, message: 'Fee record successfully save ho gaya!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Fee record save nahi ho paya' });
  }
});

app.put('/api/fee-history/:id', async (req, res) => {
  try {
    const updatedRecord = await FeeHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ success: false, error: 'Record nahi mila' });
    res.json({ success: true, message: 'Fee record successfully update ho gaya!', updatedRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update nahi ho paya' });
  }
});

app.delete('/api/fee-history/:id', async (req, res) => {
  try {
    await FeeHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee history record successfully delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ error: 'Delete nahi ho paya' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Contact messages fetch nahi ho paye' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message successfully delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ error: 'Delete nahi ho paya' });
  }
});

const gallerySchema = new mongoose.Schema({
  title: String,
  category: String, 
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const Gallery = mongoose.model('Gallery', gallerySchema);

app.post('/api/gallery/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    const imageName = req.file ? req.file.filename : '';
    const newImage = new Gallery({ title, category, image: imageName });
    await newImage.save();
    res.json({ message: 'Photo successfully upload ho gayi!' });
  } catch (err) {
    res.status(500).json({ error: 'Upload karne me error aaya' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Data fetch nahi ho paya' });
  }
});

const Announcement = require('./Announcement');

app.get('/api/announcements', async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const newAnnouncement = new Announcement({ date: req.body.date, title: req.body.title, description: req.body.description });
    await newAnnouncement.save();
    res.json({ message: "Announcement added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add announcement" });
  }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

app.get('/api/popup', async (req, res) => {
  joinRes = async () => {};
  try {
    let popup = await Popup.findOne();
    if (!popup) {
      popup = new Popup({ isActive: false, title: 'IMPORTANT NOTICE', message: '' });
      await popup.save();
    }
    res.json(popup);
  } catch (err) {
    res.status(500).json({ error: 'Popup fetch nahi ho paya' });
  }
});

app.post('/api/popup/update', upload.single('image'), async (req, res) => {
  try {
    let popup = await Popup.findOne();
    const updateData = { isActive: req.body.isActive === 'true' || req.body.isActive === true, title: req.body.title, message: req.body.message };
    if (req.file) updateData.image = req.file.filename;

    if (popup) {
      popup = await Popup.findByIdAndUpdate(popup._id, updateData, { new: true });
    } else {
      popup = new Popup(updateData);
      await popup.save();
    }
    res.json({ success: true, message: 'Popup successfully update ho gaya!', popup });
  } catch (err) {
    res.status(500).json({ error: 'Popup update nahi ho paya' });
  }
});

app.get('/', (req, res) => {
  res.send('School Website Backend API Running!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
