import candidateData from '../mockData/candidates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let candidates = [...candidateData];

const candidateService = {
  async getAll() {
    await delay(300);
    return [...candidates];
  },

  async getById(id) {
    await delay(200);
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) throw new Error('Candidate not found');
    return { ...candidate };
  },

  async create(candidateData) {
    await delay(400);
    const newCandidate = {
      ...candidateData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
      stage: 'Applied',
      assessmentScores: [],
      interviews: [],
      notes: []
    };
    candidates.push(newCandidate);
    return { ...newCandidate };
  },

  async update(id, candidateData) {
    await delay(300);
    const index = candidates.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Candidate not found');
    
    candidates[index] = { ...candidates[index], ...candidateData };
    return { ...candidates[index] };
  },

  async delete(id) {
    await delay(250);
    const index = candidates.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Candidate not found');
    
    candidates.splice(index, 1);
    return { success: true };
  }
};

export default candidateService;