import interviewData from '../mockData/interviews.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let interviews = [...interviewData];

const interviewService = {
  async getAll() {
    await delay(280);
    return [...interviews];
  },

  async getById(id) {
    await delay(200);
    const interview = interviews.find(i => i.id === id);
    if (!interview) throw new Error('Interview not found');
    return { ...interview };
  },

  async create(interviewData) {
    await delay(350);
    const newInterview = {
      ...interviewData,
      id: Date.now().toString()
    };
    interviews.push(newInterview);
    return { ...newInterview };
  },

  async update(id, interviewData) {
    await delay(300);
    const index = interviews.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Interview not found');
    
    interviews[index] = { ...interviews[index], ...interviewData };
    return { ...interviews[index] };
  },

  async delete(id) {
    await delay(250);
    const index = interviews.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Interview not found');
    
    interviews.splice(index, 1);
    return { success: true };
  }
};

export default interviewService;