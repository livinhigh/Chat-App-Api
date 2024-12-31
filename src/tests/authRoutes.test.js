const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { signup, login } = require('../controllers/authController');

// Mock the authController functions
jest.mock('../controllers/authController', () => ({
  signup: jest.fn((req, res) => res.status(201).json({ message: 'User created' })),
  login: jest.fn((req, res) => res.status(200).json({ token: 'fake-jwt-token' })),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /signup', () => {
    it('should return 201 and success message for valid input', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User created');
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ username: '', email: 'invalid-email', password: '123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /login', () => {
    it('should return 200 and token for valid input', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token', 'fake-jwt-token');
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: '', password: '' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});