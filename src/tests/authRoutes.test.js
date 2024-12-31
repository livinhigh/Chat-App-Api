const request = require('supertest');
const express = require('express');

// 1. Mock the controller functions so we don't need a real DB
jest.mock('../controllers/authController', () => ({
  signup: jest.fn(),
  login: jest.fn(),
}));

const { signup, login } = require('../controllers/authController');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    // Reset the mocks before each test so calls don't leak
    jest.clearAllMocks();
  });

  describe('POST /signup', () => {
    it('should return 400 if any required field is missing or invalid', async () => {
      // Not providing a valid email and password < 6 chars => invalid
      const response = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')  // optional, but explicit
        .send({ username: '', email: 'invalidemail', password: '123' });

      expect(response.status).toBe(400);
      // Express-validator typically returns an `errors` array in the response body
      expect(response.body).toHaveProperty('errors');
      // Our mocked controller won't be called, because validation will fail
      expect(signup).not.toHaveBeenCalled();
    });

    it('should return 201 and call signup if the input is valid', async () => {
      // Provide a valid request body
      const mockUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock the controller's signup function to respond with a success
      signup.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'User created' });
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')  // optional, but explicit
        .send(mockUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created');
      // Check that our controller was called exactly once
      expect(signup).toHaveBeenCalledTimes(1);
      // Optionally, verify it was called with the correct arguments
      // For example, signup(req, res) => the first param is `req`
      // But you can’t directly check the request body from here,
      // as supertest is abstracting that. However, you could do:
      // expect(signup.mock.calls[0][0].body).toEqual(mockUserData);
    });
  });

  describe('POST /login', () => {
    it('should return 400 for invalid input', async () => {
      // Missing username and password => invalid
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')  // optional, but explicit
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(login).not.toHaveBeenCalled();
    });

    it('should return 200 and call login if the input is valid', async () => {
      // Provide valid login credentials
      const mockLoginData = {
        username: 'testuser',
        password: 'validpassword',
      };

      // Mock the login controller
      login.mockImplementation((req, res) => {
        return res.status(200).json({ token: 'fake-jwt-token' });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')  // optional, but explicit
        .send(mockLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'fake-jwt-token');
      expect(login).toHaveBeenCalledTimes(1);
    });
  });
});
