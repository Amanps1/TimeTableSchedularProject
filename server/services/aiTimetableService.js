const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const Section = require('../models/Section');

class AITimetableService {
  constructor() {
    this.DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    this.PERIODS_PER_DAY = 6;
    this.TOTAL_SLOTS = 30; // 5 days * 6 periods
    this.POPULATION_SIZE = 50;
    this.GENERATIONS = 100;
    this.MUTATION_RATE = 0.1;
  }

  // Generate multiple optimized timetables
  async generateOptimizedTimetables(sectionId, academicYear, semester) {
    try {
      // Fetch section and department data
      const section = await Section.findById(sectionId).populate('departmentId');
      if (!section) throw new Error('Section not found');

      // Fetch subjects and staff for the department
      const subjects = await Subject.find({ departmentId: section.departmentId._id });
      const staff = await Staff.find({ departmentId: section.departmentId._id })
        .populate('expertiseSubjects');

      // Apply elective filtering (min 30 students)
      const validSubjects = this.filterElectives(subjects, section.studentCount);
      
      // Calculate staff allocation (70 students = 1 staff)
      const requiredStaff = this.calculateStaffAllocation(validSubjects, section.studentCount);

      // Generate 2-3 optimized solutions
      const solutions = [];
      for (let i = 0; i < 3; i++) {
        const solution = await this.generateSingleTimetable(
          validSubjects, 
          requiredStaff, 
          section,
          staff
        );
        if (solution) solutions.push(solution);
      }

      return solutions;
    } catch (error) {
      throw new Error(`Timetable generation failed: ${error.message}`);
    }
  }

  // Filter electives based on minimum student requirement
  filterElectives(subjects, studentCount) {
    return subjects.filter(subject => {
      if (subject.type === 'ELECTIVE') {
        return studentCount >= 30; // Min 30 students for electives
      }
      return true; // Include all core and honors subjects
    });
  }

  // Calculate staff allocation (70 students = 1 staff)
  calculateStaffAllocation(subjects, studentCount) {
    const staffRatio = Math.ceil(studentCount / 70);
    return subjects.map(subject => ({
      subject,
      requiredStaff: subject.type === 'CORE' ? staffRatio : 1
    }));
  }

  // Generate single timetable using GA + CSP
  async generateSingleTimetable(subjects, staffAllocation, section, allStaff) {
    // Initialize population
    let population = this.initializePopulation(subjects, staffAllocation, allStaff);
    
    // Evolve population using Genetic Algorithm
    for (let generation = 0; generation < this.GENERATIONS; generation++) {
      population = this.evolvePopulation(population, allStaff);
    }

    // Select best solution and apply CSP constraints
    const bestSolution = this.selectBestSolution(population);
    const optimizedSolution = this.applyCSPConstraints(bestSolution);

    return this.formatTimetable(optimizedSolution, section);
  }

  // Initialize random population
  initializePopulation(subjects, staffAllocation, allStaff) {
    const population = [];
    
    for (let i = 0; i < this.POPULATION_SIZE; i++) {
      const individual = this.createRandomIndividual(subjects, staffAllocation, allStaff);
      population.push(individual);
    }
    
    return population;
  }

  // Create random timetable individual
  createRandomIndividual(subjects, staffAllocation, allStaff) {
    const slots = [];
    const staffWorkload = new Map();

    for (let day = 0; day < 5; day++) {
      for (let period = 0; period < 6; period++) {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const availableStaff = this.getAvailableStaff(randomSubject, staffWorkload, allStaff);
        
        if (availableStaff.length > 0) {
          const selectedStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
          
          slots.push({
            day: this.DAYS[day],
            period: period + 1,
            subjectId: randomSubject._id,
            staffId: selectedStaff._id,
            room: `Room-${Math.floor(Math.random() * 20) + 1}`
          });

          // Update staff workload
          const currentLoad = staffWorkload.get(selectedStaff._id.toString()) || 0;
          staffWorkload.set(selectedStaff._id.toString(), currentLoad + 1);
        }
      }
    }

    return { slots, fitness: this.calculateFitness(slots, staffWorkload) };
  }

  // Get available staff for subject considering constraints
  getAvailableStaff(subject, staffWorkload, allStaff) {
    const expertStaff = allStaff.filter(staff => 
      staff.expertiseSubjects.some(exp => exp._id.toString() === subject._id.toString())
    );
    
    return expertStaff.filter(staff => {
      const currentLoad = staffWorkload.get(staff._id.toString()) || 0;
      return currentLoad < 18; // Max 18 hours per week
    });
  }

  // Calculate fitness score for timetable
  calculateFitness(slots, staffWorkload) {
    let fitness = 1000; // Start with perfect score

    // Penalty for constraint violations
    fitness -= this.checkClashes(slots) * 100;
    fitness -= this.checkWorkloadViolations(staffWorkload) * 50;
    fitness -= this.checkDailyLimits(slots) * 30;
    
    // Bonus for balanced workload
    fitness += this.calculateWorkloadBalance(staffWorkload) * 10;

    return Math.max(0, fitness);
  }

  // Check for time/staff clashes
  checkClashes(slots) {
    const clashes = new Set();
    const timeSlots = new Map();

    slots.forEach(slot => {
      const timeKey = `${slot.day}-${slot.period}`;
      const staffKey = `${slot.staffId}-${timeKey}`;
      
      if (timeSlots.has(staffKey)) {
        clashes.add(staffKey);
      }
      timeSlots.set(staffKey, true);
    });

    return clashes.size;
  }

  // Check staff workload violations
  checkWorkloadViolations(staffWorkload) {
    let violations = 0;
    staffWorkload.forEach(load => {
      if (load > 18) violations++; // Max 18 hours per week
    });
    return violations;
  }

  // Check daily hour limits
  checkDailyLimits(slots) {
    const dailyLoad = new Map();
    let violations = 0;

    slots.forEach(slot => {
      const key = `${slot.staffId}-${slot.day}`;
      const current = dailyLoad.get(key) || 0;
      dailyLoad.set(key, current + 1);
    });

    dailyLoad.forEach(load => {
      if (load > 6) violations++; // Max 6 hours per day
    });

    return violations;
  }

  // Calculate workload balance bonus
  calculateWorkloadBalance(staffWorkload) {
    if (staffWorkload.size === 0) return 0;
    
    const loads = Array.from(staffWorkload.values());
    const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
    const variance = loads.reduce((acc, load) => acc + Math.pow(load - avg, 2), 0) / loads.length;
    
    return Math.max(0, 100 - variance); // Lower variance = better balance
  }

  // Evolve population using GA
  evolvePopulation(population, allStaff = []) {
    // Sort by fitness
    population.sort((a, b) => b.fitness - a.fitness);
    
    const newPopulation = [];
    const eliteSize = Math.floor(this.POPULATION_SIZE * 0.2);
    
    // Keep elite individuals
    for (let i = 0; i < eliteSize; i++) {
      newPopulation.push(population[i]);
    }
    
    // Generate offspring through crossover and mutation
    while (newPopulation.length < this.POPULATION_SIZE) {
      const parent1 = this.tournamentSelection(population);
      const parent2 = this.tournamentSelection(population);
      
      let offspring = this.crossover(parent1, parent2);
      if (Math.random() < this.MUTATION_RATE) {
        offspring = this.mutate(offspring);
      }
      
      newPopulation.push(offspring);
    }
    
    return newPopulation;
  }

  // Tournament selection
  tournamentSelection(population) {
    const tournamentSize = 5;
    const tournament = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    
    return tournament.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  // Crossover operation
  crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * this.TOTAL_SLOTS);
    const childSlots = [
      ...parent1.slots.slice(0, crossoverPoint),
      ...parent2.slots.slice(crossoverPoint)
    ];
    
    const staffWorkload = new Map();
    childSlots.forEach(slot => {
      const current = staffWorkload.get(slot.staffId.toString()) || 0;
      staffWorkload.set(slot.staffId.toString(), current + 1);
    });
    
    return {
      slots: childSlots,
      fitness: this.calculateFitness(childSlots, staffWorkload)
    };
  }

  // Mutation operation
  mutate(individual) {
    const mutatedSlots = [...individual.slots];
    const mutationPoint = Math.floor(Math.random() * mutatedSlots.length);
    
    // Random change in the slot
    if (mutatedSlots[mutationPoint]) {
      mutatedSlots[mutationPoint].room = `Room-${Math.floor(Math.random() * 20) + 1}`;
    }
    
    const staffWorkload = new Map();
    mutatedSlots.forEach(slot => {
      const current = staffWorkload.get(slot.staffId.toString()) || 0;
      staffWorkload.set(slot.staffId.toString(), current + 1);
    });
    
    return {
      slots: mutatedSlots,
      fitness: this.calculateFitness(mutatedSlots, staffWorkload)
    };
  }

  // Select best solution from final population
  selectBestSolution(population) {
    return population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  // Apply CSP constraints for final optimization
  applyCSPConstraints(solution) {
    // Remove constraint violations
    const validSlots = solution.slots.filter(slot => {
      // Add CSP validation logic here
      return true; // Simplified for now
    });
    
    return { ...solution, slots: validSlots };
  }

  // Format timetable for database storage
  formatTimetable(solution, section) {
    return {
      sectionId: section._id,
      academicYear: '2024-25',
      semester: 1,
      slots: solution.slots,
      fitness: solution.fitness,
      generatedAt: new Date()
    };
  }
}

module.exports = new AITimetableService();