const winston = require('winston');
const request = require('supertest');
const app = require('../app');

describe('User Routes', () => {
    beforeAll(async () => {
        
    });

    afterAll(async () => {
      
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users/signup')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                country: 'US'
            });
        expect(res.statusCode).toBe(302);
        expect(res.header['location']).toBe('/existinguser');
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'johndoe@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(302);
        expect(res.header['location']).toBe('/create');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'johndoe@example.com',
                password: 'incorrectpassword'
            });
        expect(res.statusCode).toBe(302);
        expect(res.header['location']).toBe('/unknown');
    });
});
