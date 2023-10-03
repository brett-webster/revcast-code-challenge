const axiosMockToExport = {
  get: jest.fn().mockResolvedValue({ data: [1, 2, 3] }), // dummy data needed to avoid error
  post: jest.fn().mockResolvedValue({ data: [4, 3, 2] }), // dummy data needed to avoid error
};

export default axiosMockToExport;
