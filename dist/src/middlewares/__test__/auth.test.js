"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@src/services/auth"));
const auth_2 = require("@src/middlewares/auth");
describe('Auth Middleware', () => {
    it('Should verify a JWT token and call the next() middleware', async () => {
        const jwttoken = auth_1.default.generateToken({ data: 'fake' });
        const reqFake = {
            headers: {
                'x-access-token': jwttoken,
            },
        };
        const resFake = {};
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake());
        expect(nextFake).toHaveBeenCalled();
    });
    it('Should Return UNAUTHORIZED if there is a problem on the token verification', async () => {
        const reqFake = {
            headers: {
                'x-access-token': 'invalid-Token',
            },
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt malformed',
        });
    });
    it('Should return UNAUTHORIZED middleware if there no token', async () => {
        const reqFake = {
            headers: {},
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        (0, auth_2.authMiddleware)(reqFake, resFake, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt must be provided',
        });
    });
});
//# sourceMappingURL=auth.test.js.map