import assessmentData from '../mockData/assessments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let assessments = [...assessmentData];

const assessmentService = {
  async getAll() {
    await delay(250);
    return [...assessments];
  },

  async getById(id) {
    await delay(200);
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) throw new Error('Assessment not found');
    return { ...assessment };
  },

  async create(assessmentData) {
    await delay(400);
    const newAssessment = {
      ...assessmentData,
      id: Date.now().toString()
    };
    assessments.push(newAssessment);
    return { ...newAssessment };
  },

  async update(id, assessmentData) {
    await delay(300);
    const index = assessments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Assessment not found');
    
    assessments[index] = { ...assessments[index], ...assessmentData };
    return { ...assessments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = assessments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Assessment not found');
    
    assessments.splice(index, 1);
    return { success: true };
  }
};

export default assessmentService;