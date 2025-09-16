class AITimetableEngine {
  constructor() {
    this.timeSlots = [
      { period: 1, time: '9:00-10:00', start: '9:00', end: '10:00' },
      { period: 2, time: '10:00-11:00', start: '10:00', end: '11:00' },
      { period: 3, time: '11:30-12:30', start: '11:30', end: '12:30' },
      { period: 4, time: '12:30-1:30', start: '12:30', end: '1:30' },
      { period: 5, time: '2:30-3:30', start: '2:30', end: '3:30' },
      { period: 6, time: '3:30-4:30', start: '3:30', end: '4:30' }
    ];
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  async generateTimetables(params) {
    const { section, subjects, staff, rules, subjectStaffMapping } = params;
    
    console.log('🤖 AI Timetable Engine: Generating 3 optimized timetables...');
    
    // Parse custom rules
    const parsedRules = this.parseRules(rules);
    
    // Create subject pool based on hours per week
    const subjectPool = this.createSubjectPool(subjects);
    
    // Generate 3 different timetables using genetic algorithm
    const timetables = [];
    
    for (let i = 0; i < 3; i++) {
      const timetable = await this.generateSingleTimetable(
        subjectPool, 
        staff, 
        subjectStaffMapping, 
        parsedRules,
        i + 1
      );
      
      const score = this.calculateEfficiencyScore(timetable, parsedRules, staff);
      
      timetables.push({
        id: `timetable_${String.fromCharCode(65 + i)}`, // A, B, C
        name: `Timetable ${String.fromCharCode(65 + i)}`,
        schedule: timetable,
        score: score.total,
        breakdown: score.breakdown,
        efficiency: Math.round(score.total)
      });
    }
    
    // Sort by score (highest first)
    timetables.sort((a, b) => b.score - a.score);
    
    // Mark the most efficient
    timetables[0].isMostEfficient = true;
    
    console.log('📊 Timetable Scores:');
    timetables.forEach(t => {
      console.log(`${t.name}: ${t.efficiency}% ${t.isMostEfficient ? '(MOST EFFICIENT)' : ''}`);
    });
    
    return {
      success: true,
      timetables,
      mostEfficient: timetables[0].name,
      summary: {
        generated: 3,
        bestScore: timetables[0].efficiency,
        algorithm: 'Genetic Algorithm with Rule-based Scoring'
      }
    };
  }

  parseRules(rules) {
    const parsed = {
      maxContinuousHours: 3,
      maxDailyHours: 6,
      maxWeeklyHours: 18,
      preferredSlots: {},
      avoidSlots: {},
      blockTeaching: false,
      labBlocks: true
    };
    
    if (!rules || !Array.isArray(rules)) return parsed;
    
    rules.forEach(rule => {
      const lowerRule = rule.toLowerCase();
      
      if (lowerRule.includes('continuous') && lowerRule.includes('hour')) {
        const match = lowerRule.match(/(\d+)/);
        if (match) parsed.maxContinuousHours = parseInt(match[1]);
      }
      
      if (lowerRule.includes('daily') && lowerRule.includes('hour')) {
        const match = lowerRule.match(/(\d+)/);
        if (match) parsed.maxDailyHours = parseInt(match[1]);
      }
      
      if (lowerRule.includes('morning') && lowerRule.includes('core')) {
        parsed.preferredSlots.core = [1, 2, 3];
      }
      
      if (lowerRule.includes('afternoon') && lowerRule.includes('elective')) {
        parsed.preferredSlots.elective = [4, 5, 6];
      }
      
      if (lowerRule.includes('lab') && lowerRule.includes('block')) {
        parsed.labBlocks = true;
      }
      
      if (lowerRule.includes('block teaching')) {
        parsed.blockTeaching = true;
      }
    });
    
    return parsed;
  }

  createSubjectPool(subjects) {
    const pool = [];
    subjects.forEach(subject => {
      const hours = subject.hoursPerWeek || 4;
      for (let i = 0; i < hours; i++) {
        pool.push({
          ...subject,
          instanceId: `${subject._id}_${i}`
        });
      }
    });
    return pool;
  }

  async generateSingleTimetable(subjectPool, staff, subjectStaffMapping, rules, variation) {
    const timetable = {};
    const staffWorkload = new Map();
    const staffDailyLoad = new Map();
    
    // Initialize timetable structure
    this.days.forEach(day => {
      timetable[day] = {};
      this.timeSlots.forEach(slot => {
        timetable[day][slot.period] = null;
      });
    });
    
    // Shuffle subject pool for variation
    const shuffledPool = [...subjectPool].sort(() => Math.random() - 0.5);
    
    // Apply genetic algorithm principles
    let currentPool = shuffledPool;
    for (let generation = 0; generation < 10; generation++) {
      currentPool = this.evolveGeneration(currentPool, rules, variation);
    }
    
    // Place subjects in timetable
    let poolIndex = 0;
    
    for (const day of this.days) {
      for (const slot of this.timeSlots) {
        if (poolIndex >= currentPool.length) break;
        
        const subject = currentPool[poolIndex];
        const staffId = subjectStaffMapping[subject._id];
        const staffMember = staff.find(s => s._id.toString() === staffId);
        
        if (this.canPlaceSubject(subject, staffMember, day, slot.period, staffWorkload, staffDailyLoad, rules)) {
          timetable[day][slot.period] = {
            subject: subject.name,
            code: subject.code,
            type: subject.type,
            teacher: staffMember?.name || 'TBA',
            room: `${subject.code.split('_')[0]}-${Math.floor(Math.random() * 20) + 101}`,
            time: slot.time
          };
          
          // Update workload tracking
          if (staffMember) {
            const staffKey = staffMember._id.toString();
            const dayKey = `${staffKey}_${day}`;
            
            staffWorkload.set(staffKey, (staffWorkload.get(staffKey) || 0) + 1);
            staffDailyLoad.set(dayKey, (staffDailyLoad.get(dayKey) || 0) + 1);
          }
          
          poolIndex++;
        }
      }
    }
    
    return timetable;
  }

  evolveGeneration(pool, rules, variation) {
    // Simple genetic algorithm: mutation based on rules
    const evolved = [...pool];
    
    // Apply mutations based on variation
    const mutationRate = 0.1 + (variation * 0.05);
    
    for (let i = 0; i < evolved.length; i++) {
      if (Math.random() < mutationRate) {
        // Swap with another subject (mutation)
        const swapIndex = Math.floor(Math.random() * evolved.length);
        [evolved[i], evolved[swapIndex]] = [evolved[swapIndex], evolved[i]];
      }
    }
    
    // Apply rule-based sorting
    evolved.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // Prefer core subjects in morning (if rule exists)
      if (rules.preferredSlots.core && a.type === 'CORE') scoreA += 10;
      if (rules.preferredSlots.core && b.type === 'CORE') scoreB += 10;
      
      // Prefer electives in afternoon (if rule exists)
      if (rules.preferredSlots.elective && a.type === 'ELECTIVE') scoreA += 5;
      if (rules.preferredSlots.elective && b.type === 'ELECTIVE') scoreB += 5;
      
      return scoreB - scoreA;
    });
    
    return evolved;
  }

  canPlaceSubject(subject, staffMember, day, period, staffWorkload, staffDailyLoad, rules) {
    if (!staffMember) return true; // Projects/electives without staff
    
    const staffKey = staffMember._id.toString();
    const dayKey = `${staffKey}_${day}`;
    
    // Check weekly workload limit
    const weeklyLoad = staffWorkload.get(staffKey) || 0;
    if (weeklyLoad >= rules.maxWeeklyHours) return false;
    
    // Check daily workload limit
    const dailyLoad = staffDailyLoad.get(dayKey) || 0;
    if (dailyLoad >= rules.maxDailyHours) return false;
    
    return true;
  }

  calculateEfficiencyScore(timetable, rules, staff) {
    let ruleCompliance = 0;
    let teacherBalance = 0;
    let studentComfort = 0;
    let roomUtilization = 0;
    
    // 1. Rule Compliance (50%)
    ruleCompliance = this.calculateRuleCompliance(timetable, rules);
    
    // 2. Teacher Load Balance (25%)
    teacherBalance = this.calculateTeacherBalance(timetable, staff);
    
    // 3. Student Comfort (15%)
    studentComfort = this.calculateStudentComfort(timetable, rules);
    
    // 4. Room Utilization (10%)
    roomUtilization = this.calculateRoomUtilization(timetable);
    
    const total = (ruleCompliance * 0.5) + (teacherBalance * 0.25) + (studentComfort * 0.15) + (roomUtilization * 0.1);
    
    return {
      total,
      breakdown: {
        ruleCompliance: Math.round(ruleCompliance),
        teacherBalance: Math.round(teacherBalance),
        studentComfort: Math.round(studentComfort),
        roomUtilization: Math.round(roomUtilization)
      }
    };
  }

  calculateRuleCompliance(timetable, rules) {
    let score = 100;
    let violations = 0;
    
    // Check for continuous hours violation
    this.days.forEach(day => {
      let continuousCount = 0;
      this.timeSlots.forEach(slot => {
        if (timetable[day][slot.period]) {
          continuousCount++;
          if (continuousCount > rules.maxContinuousHours) {
            violations++;
          }
        } else {
          continuousCount = 0;
        }
      });
    });
    
    // Deduct points for violations
    score -= violations * 10;
    
    return Math.max(0, score);
  }

  calculateTeacherBalance(timetable, staff) {
    const teacherLoads = new Map();
    
    // Count teacher assignments
    this.days.forEach(day => {
      this.timeSlots.forEach(slot => {
        const entry = timetable[day][slot.period];
        if (entry && entry.teacher !== 'TBA') {
          teacherLoads.set(entry.teacher, (teacherLoads.get(entry.teacher) || 0) + 1);
        }
      });
    });
    
    if (teacherLoads.size === 0) return 100;
    
    // Calculate balance (lower standard deviation = better balance)
    const loads = Array.from(teacherLoads.values());
    const mean = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const variance = loads.reduce((sum, load) => sum + Math.pow(load - mean, 2), 0) / loads.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to score (lower stdDev = higher score)
    return Math.max(0, 100 - (stdDev * 10));
  }

  calculateStudentComfort(timetable, rules) {
    let score = 100;
    let violations = 0;
    
    // Check for too many continuous classes
    this.days.forEach(day => {
      let continuousCount = 0;
      this.timeSlots.forEach(slot => {
        if (timetable[day][slot.period]) {
          continuousCount++;
        } else {
          if (continuousCount > 3) violations++;
          continuousCount = 0;
        }
      });
      if (continuousCount > 3) violations++;
    });
    
    score -= violations * 15;
    return Math.max(0, score);
  }

  calculateRoomUtilization(timetable) {
    const roomUsage = new Map();
    let totalSlots = 0;
    
    this.days.forEach(day => {
      this.timeSlots.forEach(slot => {
        const entry = timetable[day][slot.period];
        if (entry) {
          roomUsage.set(entry.room, (roomUsage.get(entry.room) || 0) + 1);
          totalSlots++;
        }
      });
    });
    
    if (totalSlots === 0) return 100;
    
    // Better utilization = fewer rooms used for same number of classes
    const uniqueRooms = roomUsage.size;
    const utilizationRatio = totalSlots / uniqueRooms;
    
    // Score based on utilization efficiency
    return Math.min(100, utilizationRatio * 20);
  }
}

module.exports = new AITimetableEngine();