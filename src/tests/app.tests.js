const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should return API is running...', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('API is running...');
  });
});
