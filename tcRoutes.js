const express = require('express');
const router = express.Router();
const Student_Data_Tc = require('./tcModel');

// 1. Create TC Data
router.post('/add', async (req, res) => {
  try {
    const newTc = new Student_Data_Tc(req.body);
    const savedTc = await newTc.save();
    res.status(201).json({ success: true, data: savedTc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get All TC Data
router.get('/all', async (req, res) => {
  try {
    const tcs = await Student_Data_Tc.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tcs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update TC Data
router.put('/update/:id', async (req, res) => {
  try {
    const updatedTc = await Student_Data_Tc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedTc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Delete TC Data
router.delete('/delete/:id', async (req, res) => {
  try {
    await Student_Data_Tc.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'TC Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;