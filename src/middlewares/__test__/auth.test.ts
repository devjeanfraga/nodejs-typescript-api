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

  it('Should Return UNAUTHORIZED if there is a problem on the token verification', async () => {
    const reqFake = {
      headers: {
        "x-access-token": 'invalid-Token'
      }
    };

    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })), 
    };

    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it('Should return UNAUTHORIZED middleware if there no token', async () => {
    const reqFake = {
      headers: {} // tratamento do return undefined
    };

    const sendMock= jest.fn();
    const resFake = {
      status: jest.fn(()=> ({
        send: sendMock,
      }))
    };
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided'
    })
  })
})