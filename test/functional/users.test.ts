import { User } from '@src/models/users';

describe('Users functional tests', () => {
  beforeAll(async () => await User.deleteMany({}));

  describe('When create a new user', () => {
    it('Should successfully create a new user', async () => {
      const newUser = {
        name: 'Jupiter',
        email: 'jupiter@mail.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('Should return 400 when there is an validation Error', async () => {
      const newUser = {
        email: 'jupiter@mail.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'User validation failed: name: Path `name` is required.'
      });
    });
  });
});
