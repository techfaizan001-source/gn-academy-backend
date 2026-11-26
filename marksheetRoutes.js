// Yeh file marksheet ke liye URL endpoints (API routes) define karti hai.
const express = require('express');
const router = express.Router();
const { saveOrUpdateMarksheet, getStudentMarksheet, getAllMarksheets, deleteStudentMarksheet } = require('./marksheetController');

router.post('/save', saveOrUpdateMarksheet);
router.get('/get', getStudentMarksheet);
router.get('/get-all', getAllMarksheets);
router.delete('/delete/:id', deleteStudentMarksheet);

module.exports = router;