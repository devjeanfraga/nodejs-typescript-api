import { User } from '@src/models/users';
import AuthServices from '@src/services/auth';

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
      await expect(AuthServices.comparePasword(newUser.password, response.body.password)).resolves.toBeTruthy(); //toBeTruthy trabalha com boolean em boolean
      expect(response.body).toEqual(expect.objectContaining(
        { 
          ...newUser, 
          ...{password: expect.any(String)}
        })
      );
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

  describe('When Authentication an User', () => {
    it('Should return a token for a valid user', async () => {
      const newUser = {
        name: 'Saturno',
        email: 'Saturno@jupiter.com',
        password: '123456'
      }
      /***LEMBRETE***/
      // na verdade antes de passar o token, deveriamos enviar um e-mail de ocnfirmação
      // assim que o usuário se cadastra 
      await new User(newUser).save();
      const response = await global.testRequest.post('/users/authenticate').send(
        { 
          email:newUser.email,
          password: newUser.password
        });
      
       expect(response.body).toEqual(expect.objectContaining({token: expect.any(String)}));  
    });

    it('Should return UNAUTHORIZED Error with status 401', async ()=> {
      const response = await global.testRequest.post('/users/authenticate').send({email: 'jean@jean', password: '827892402'});
      expect(response.status).toBe(401)
    });

    it('Should return UNAUTHORIZED if find an user but the password doesnt match', async ()=> {
      const newUser = {
        name: 'Domingo',
        email: 'domingo@jupiter.com',
        password: '123456'
      };
      await new User(newUser).save();
      const response = await global.testRequest.post('/users/authenticate').send({
        email: newUser.email,
        password: '3847rnbdwe',
      });
      expect(response.status).toBe(401);
    })
  });

});

