import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointmentsAPI } from '../../services/api.js'

const counselors = [
  { id: 'therapist1', name: 'Dr. A. Sharma', specialty: 'Cognitive Behavioral Therapy', photo: '/avatar1.png' },
  { id: 'therapist2', name: 'Ms. R. Iyer', specialty: 'Anxiety & Depression', photo: '/avatar2.png' },
]

export function Counselor() {
  const [selected, setSelected] = useState(null)
  const [slot, setSlot] = useState('10:00')
  const [selectedDate, setSelectedDate] = useState('')
  const [booked, setBooked] = useState(false)
  const [lastAppointment, setLastAppointment] = useState(null)
  const [bookingError, setBookingError] = useState('')
  const navigate = useNavigate()

  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Available Counselors</h2>
        <div className="grid grid-3">
          {counselors.map(c => (
            <button key={c.id} className="card btn" onClick={()=>setSelected(c)}>
              <img src={c.photo} alt="" style={{borderRadius:12}} />
              <div>
                <h4>{c.name}</h4>
                <p className="pill">{c.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Book Appointment</h3>
        {!selected ? <p>Select a counselor above</p> : (
          <div>
            <p>With <strong>{selected.name}</strong></p>
            <label>Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value)
                setBookingError('')
              }}
              min={new Date().toISOString().split('T')[0]}
            />
            <label>Time</label>
            <select value={slot} onChange={e=>setSlot(e.target.value)}>
              {['10:00','11:00','14:00','15:00'].map(s=> <option key={s}>{s}</option>)}
            </select>
            
            {bookingError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                color: '#ef4444',
                marginTop: '10px',
                fontSize: '14px'
              }}>
                {bookingError}
              </div>
            )}
            
            <button 
              className="btn primary" 
              style={{marginTop:10}} 
              disabled={!selectedDate}
              onClick={async ()=>{
                if (!selectedDate) {
                  setBookingError('Please select a date before booking')
                  return
                }
                
                const token = localStorage.getItem('token')
                if (!token) { 
                  alert('Please login first'); 
                  navigate('/login?role=student'); 
                  return 
                }
                
                try {
                  // Combine date and time
                  const appointmentDateTime = new Date(`${selectedDate}T${slot}:00`)
                  const res = await AppointmentsAPI.book({ 
                    studentId: '000000000000000000000001', 
                    counselorId: selected.id, 
                    startsAt: appointmentDateTime.toISOString() 
                  })
                  setBooked(true)
                  setLastAppointment(res)
                  setBookingError('')
                  localStorage.setItem('lastAppointmentId', res._id || '')
                  
                  // Store appointment data for dashboard display
                  const appointmentData = {
                    _id: res._id,
                    startsAt: appointmentDateTime.toISOString(),
                    counselorName: selected.name,
                    specialty: selected.specialty,
                    studentId: res.studentId || '000000000000000000000001'
                  }
                  localStorage.setItem('upcomingAppointment', JSON.stringify(appointmentData))
                } catch (error) {
                  setBookingError('Failed to book appointment. Please try again.')
                  console.error('Booking error:', error)
                }
              }}
            >
              {selectedDate ? 'Book Appointment' : 'Select Date First'}
            </button>
            {booked && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '12px',
                color: '#10b981',
                marginTop: '10px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✅ Successfully booked for {selectedDate} at {slot}. Your appointment has been saved.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}


