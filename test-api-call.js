const axios = require('axios');

const testAPICall = async () => {
  try {
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'pooja.saxena@cse.college.edu',
      password: 'staff123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Call staff timetable API
    const timetableResponse = await axios.get('http://localhost:5000/api/staff/timetable', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`\n📅 Timetable API Response:`);
    console.log(`Status: ${timetableResponse.status}`);
    console.log(`Slots returned: ${timetableResponse.data.length}`);
    
    timetableResponse.data.forEach(slot => {
      console.log(`${slot.day} Period ${slot.period}: ${slot.subjectId?.name || 'Unknown'} (${slot.room})`);
    });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
};

testAPICall();