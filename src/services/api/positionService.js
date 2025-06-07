import positionData from '../mockData/positions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let positions = [...positionData];

const positionService = {
  async getAll() {
    await delay(220);
    return [...positions];
  },

  async getById(id) {
    await delay(200);
    const position = positions.find(p => p.id === id);
    if (!position) throw new Error('Position not found');
    return { ...position };
  },

  async create(positionData) {
    await delay(350);
    const newPosition = {
      ...positionData,
      id: Date.now().toString()
    };
    positions.push(newPosition);
    return { ...newPosition };
  },

  async update(id, positionData) {
    await delay(300);
    const index = positions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Position not found');
    
    positions[index] = { ...positions[index], ...positionData };
    return { ...positions[index] };
  },

  async delete(id) {
    await delay(250);
    const index = positions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Position not found');
    
    positions.splice(index, 1);
    return { success: true };
  }
};

export default positionService;