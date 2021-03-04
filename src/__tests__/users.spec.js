const request = require('supertest');
const { validate } = require('uuid');

const { app } = require('../');

describe('Users', () => {
  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe1'
      });

    expect(validate(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      name: 'John Doe',
      username: 'johndoe1',
      todos: [],
      pro: false
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new user when username already exists', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe2'
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe2'
      })
      .expect(400);

    expect(response.body.error).toBeTruthy();
  });

  it('should be able to show user data', async () => {
    const { body: userData } = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe3'
      });

    const response = await request(app)
      .get(`/users/${userData.id}`);

    expect(response.body).toMatchObject({
      name: 'John Doe',
      username: 'johndoe3',
      todos: [],
      pro: false
    })
  });
});