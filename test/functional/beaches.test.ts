import { Beach } from '@src/models/beach';
import { User } from '@src/models/users';
import AuthServices from '@src/services/auth';

describe('Beaches functional test', () => {
  /* ***Default Config*** 
  # Cria um usuário padrão
  # Cria uma varial do tipo let para ser
    atribuida ao metodo de criar um token
  # Usa o método beforesEach 
    para limpar o DB antes de cada test
  # cria um usuario e salva no DB
  # gera um token com as infos do usario;
  */

  const defaultUser = {
    name: 'Saturno',
    email: 'saturno@gmail',
    password: 'saturno25',
  };
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthServices.generateToken(user.toJSON());
    // O usuário deve ser em
    // json para que seja um objeto
  });

  describe('When create a beach', () => {
    it('Should create a beach with success', async () => {
      const newBeach = {
        name: 'Manly',
        position: 'E',
        lat: -33.792726,
        lng: 151.289824,
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
      // Para o expect.objectContaining()
      // basta que tenha essas chaves do
      // newBeache dentro do objeto, mesmo
      // tendo outras chaves dentro
      // do objeto como o Id que é dinamico;
    });

    it('should return a validation Error', async () => {
      const newBeach = {
        name: 'Manly',
        position: 'E',
        lat: 'invalid_string',
        lng: 151.289824,
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(400);
     
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.lat should be number',
      });
    });

    it.skip('Should return 500 when there is any error other than validation error', async () => {
      //Todo;
    });
  });
});


