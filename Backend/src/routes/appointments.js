import { Router } from 'express'
import mongoose from 'mongoose'
import Appointment from '../models/Appointment.js'
import User from '../models/User.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = Router()

router.post('/book', protectRoute, async (req, res) => {
  try {
    const { studentId, counselorId, startsAt } = req.body
    
    // Find student - handle demo user case
    let student = null
    if (studentId === '000000000000000000000001') {
      // This is a demo student ID, create or find a demo student
      student = await User.findOne({ username: 'student_demo' })
      if (!student) {
        // Create a demo student if it doesn't exist
        student = await User.create({
          name: 'Demo Student',
          email: 'student@university.edu',
          username: 'student_demo',
          password: 'demo123',
          role: 'student'
        })
      }
    } else {
      // Find student by username first
      student = await User.findOne({ username: studentId })
      
      // If not found by username, try by ObjectId
      if (!student && mongoose.Types.ObjectId.isValid(studentId)) {
        student = await User.findById(studentId)
      }
    }
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    
    // Find counselor/therapist by username if counselorId is a username
    // First try to find by username (most common case)
    let counselor = await User.findOne({ username: counselorId })
    
    // If not found by username, try by ObjectId (only if it looks like an ObjectId)
    if (!counselor && mongoose.Types.ObjectId.isValid(counselorId)) {
      counselor = await User.findById(counselorId)
    }
    
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor/Therapist not found' })
    }
    
    const appt = await Appointment.create({ 
      studentId: student._id, 
      counselorId: counselor._id, 
      startsAt 
    })
    
    // Populate the response
    await appt.populate('studentId', 'name email')
    await appt.populate('counselorId', 'name specialty username')
    res.status(201).json(appt)
  } catch (error) {
    console.error('Error booking appointment:', error)
    res.status(500).json({ message: 'Error booking appointment', error: error.message })
  }
})

// Get appointments for a specific therapist/counselor
router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params
    const { date } = req.query // Optional date filter
    
    // Find therapist by username first
    let therapist = await User.findOne({ username: therapistId })
    
    // If not found by username, try by ObjectId
    if (!therapist && mongoose.Types.ObjectId.isValid(therapistId)) {
      therapist = await User.findById(therapistId)
    }
    
    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' })
    }
    
    let query = { counselorId: therapist._id }
    
    // If date is provided, filter by that date
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      query.startsAt = {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }
    
    const appointments = await Appointment.find(query)
      .populate('studentId', 'name email')
      .populate('counselorId', 'name specialty username')
      .sort({ startsAt: 1 })
    
    res.json(appointments)
  } catch (error) {
    console.error('Error fetching therapist appointments:', error)
    res.status(500).json({ message: 'Error fetching appointments', error: error.message })
  }
})

// Get all appointments for a therapist (with date range)
router.get('/therapist/:therapistId/all', async (req, res) => {
  try {
    const { therapistId } = req.params
    
    // Find therapist by username first
    let therapist = await User.findOne({ username: therapistId })
    
    // If not found by username, try by ObjectId
    if (!therapist && mongoose.Types.ObjectId.isValid(therapistId)) {
      therapist = await User.findById(therapistId)
    }
    
    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' })
    }
    
    const appointments = await Appointment.find({ counselorId: therapist._id })
      .populate('studentId', 'name email')
      .populate('counselorId', 'name specialty')
      .sort({ startsAt: 1 })
    
    res.json(appointments)
  } catch (error) {
    console.error('Error fetching all therapist appointments:', error)
    res.status(500).json({ message: 'Error fetching appointments', error: error.message })
  }
})

export default router


