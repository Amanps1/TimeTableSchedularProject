const Slot = require('../models/Slot');
const Staff = require('../models/Staff');
const Subject = require('../models/Subject');

class TimetableService {
  constructor() {
    this.days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    this.periods = [1, 2, 3, 4, 5, 6];
    this.populationSize = 50;
    this.generations = 100;
    this.mutationRate = 0.1;
  }

  async generateTimetable(sectionId, subjects, staffList) {
    // Validate staff-subject compatibility
    const validatedSubjects = subjects.filter(subject => {
      const availableStaff = staffList.filter(staff => 
        staff.expertiseSubjects.some(expertiseId => 
          expertiseId.toString() === subject._id.toString()
        )
      );
      return availableStaff.length > 0;
    });

    if (validatedSubjects.length === 0) {
      throw new Error('No staff available for the given subjects');
    }

    const population = this.initializePopulation(validatedSubjects, staffList);
    
    for (let gen = 0; gen < this.generations; gen++) {
      const fitness = population.map(individual => this.calculateFitness(individual));
      const parents = this.selection(population, fitness);
      const offspring = this.crossover(parents);
      const mutated = this.mutation(offspring);
      population.splice(0, population.length, ...mutated);
    }
    
    const bestIndividual = this.getBestIndividual(population);
    return this.convertToSlots(bestIndividual, sectionId);
  }

  initializePopulation(subjects, staffList) {
    const population = [];
    
    for (let i = 0; i < this.populationSize; i++) {
      const individual = [];
      
      for (const subject of subjects) {
        // Find staff who can teach this specific subject
        const availableStaff = staffList.filter(staff => 
          staff.expertiseSubjects.some(expertiseId => 
            expertiseId.toString() === subject._id.toString()
          )
        );
        
        if (availableStaff.length === 0) {
          console.warn(`No staff available for subject: ${subject.name}`);
          continue;
        }
        
        for (let h = 0; h < subject.hoursPerWeek; h++) {
          const day = this.days[Math.floor(Math.random() * this.days.length)];
          const period = this.periods[Math.floor(Math.random() * this.periods.length)];
          const staff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
          
          individual.push({
            subjectId: subject._id,
            staffId: staff._id,
            day,
            period,
            room: `Room-${Math.floor(Math.random() * 20) + 1}`
          });
        }
      }
      
      population.push(individual);
    }
    
    return population;
  }

  calculateFitness(individual) {
    let fitness = 100;
    
    // Check for clashes
    const timeSlots = new Map();
    const staffSchedule = new Map();
    
    for (const slot of individual) {
      const timeKey = `${slot.day}-${slot.period}`;
      const staffKey = `${slot.staffId}-${slot.day}-${slot.period}`;
      
      // Room clash penalty
      if (timeSlots.has(`${timeKey}-${slot.room}`)) {
        fitness -= 20;
      }
      timeSlots.set(`${timeKey}-${slot.room}`, true);
      
      // Staff clash penalty
      if (staffSchedule.has(staffKey)) {
        fitness -= 30;
      }
      staffSchedule.set(staffKey, true);
    }
    
    // Check staff workload balance
    const staffWorkload = new Map();
    for (const slot of individual) {
      staffWorkload.set(slot.staffId, (staffWorkload.get(slot.staffId) || 0) + 1);
    }
    
    for (const [staffId, hours] of staffWorkload) {
      if (hours > 18) fitness -= 25; // Max hours violation
      if (hours > 6) fitness -= 10; // Daily limit approximation
    }
    
    return Math.max(0, fitness);
  }

  selection(population, fitness) {
    const parents = [];
    const totalFitness = fitness.reduce((sum, f) => sum + f, 0);
    
    for (let i = 0; i < this.populationSize; i++) {
      let random = Math.random() * totalFitness;
      let sum = 0;
      
      for (let j = 0; j < population.length; j++) {
        sum += fitness[j];
        if (sum >= random) {
          parents.push(population[j]);
          break;
        }
      }
    }
    
    return parents;
  }

  crossover(parents) {
    const offspring = [];
    
    for (let i = 0; i < parents.length; i += 2) {
      const parent1 = parents[i];
      const parent2 = parents[i + 1] || parents[0];
      
      const crossoverPoint = Math.floor(Math.random() * parent1.length);
      const child1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
      const child2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];
      
      offspring.push(child1, child2);
    }
    
    return offspring.slice(0, this.populationSize);
  }

  mutation(population) {
    return population.map(individual => {
      if (Math.random() < this.mutationRate) {
        const mutationIndex = Math.floor(Math.random() * individual.length);
        individual[mutationIndex].day = this.days[Math.floor(Math.random() * this.days.length)];
        individual[mutationIndex].period = this.periods[Math.floor(Math.random() * this.periods.length)];
      }
      return individual;
    });
  }

  getBestIndividual(population) {
    const fitness = population.map(individual => this.calculateFitness(individual));
    const maxFitness = Math.max(...fitness);
    return population[fitness.indexOf(maxFitness)];
  }

  convertToSlots(individual, timetableId) {
    return individual.map(slot => ({
      timetableId,
      day: slot.day,
      period: slot.period,
      subjectId: slot.subjectId,
      staffId: slot.staffId,
      room: slot.room
    }));
  }

  async rescheduleForLeave(staffId, startDate, endDate) {
    // Find affected slots
    const affectedSlots = await Slot.find({
      staffId,
      // Add date range logic here
    }).populate('subjectId');

    // Find substitute staff with same subject expertise
    const substitutes = [];
    for (const slot of affectedSlots) {
      const availableStaff = await Staff.find({
        expertiseSubjects: { $in: [slot.subjectId._id] },
        _id: { $ne: staffId }
      });
      
      if (availableStaff.length > 0) {
        // Choose staff with lowest current workload
        const sortedStaff = availableStaff.sort((a, b) => a.currentWorkload - b.currentWorkload);
        slot.staffId = sortedStaff[0]._id;
        substitutes.push(slot);
      } else {
        console.warn(`No substitute found for ${slot.subjectId.name}`);
      }
    }

    return substitutes;
  }
}

module.exports = new TimetableService();