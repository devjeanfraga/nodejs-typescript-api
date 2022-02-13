import AuthServices from "@src/services/auth";
import {authMiddleware} from '@src/middlewares/auth'

describe('Auth Middleware', () => {
  it('Should verify a JWT token and call the next() middleware', async() => {
    const jwttoken = AuthServices.generateToken({ data: 'fake'} );
    const reqFake = {
      headers: {
        'x-access-token': jwttoken
      }
    };
    const resFake = {};
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake());
    expect(nextFake).toHaveBeenCalled();
  });


})