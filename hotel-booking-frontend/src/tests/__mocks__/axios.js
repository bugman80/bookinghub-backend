const axios = jest.createMockFromModule('axios');

axios.create = jest.fn(() => axios);

// Mock degli interceptors
axios.interceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() },
};

// Mock delle funzioni get e post
axios.get = jest.fn();
axios.post = jest.fn();
axios.delete = jest.fn();

export default axios;