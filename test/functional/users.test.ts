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

    it('Should return 422 when there is a validation Error', async () => {
      const newUser = {
        email: 'saturno@mail.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should Return 409 when the email already exists', async () => {
      const newUser = {
        name: 'Jupiter',
        email: 'jupiter@mail.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database',
      });
    });


  });
});
