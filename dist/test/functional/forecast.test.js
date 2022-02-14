"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beach_1 = require("@src/models/beach");
const nock_1 = __importDefault(require("nock"));
const stormGlass_weather_3_hours_json_1 = __importDefault(require("@test/fixtures/stormGlass_weather_3_hours.json"));
const api_forecast_response_1_beach_json_1 = __importDefault(require("@test/fixtures/api_forecast_response_1_beach.json"));
const users_1 = require("@src/models/users");
const auth_1 = __importDefault(require("@src/services/auth"));
describe('Beach forecast fucntional', () => {
    const defaultUser = {
        name: 'Saturno',
        email: 'saturno@gmail',
        password: 'saturno25',
    };
    let token;
    beforeEach(async () => {
        await beach_1.Beach.deleteMany({});
        await users_1.User.deleteMany({});
        const user = await new users_1.User(defaultUser).save();
        const defaultBeach = {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: beach_1.BeachPosition.E,
            user: user.id,
        };
        token = auth_1.default.generateToken(user.toJSON());
        new beach_1.Beach(defaultBeach).save();
    });
    it('should return a forecast with just a few times', async () => {
        (0, nock_1.default)('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: () => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({
            lat: -33.792726,
            lng: 151.289824,
            params: /(.*)/,
            source: 'noaa',
        })
            .reply(200, stormGlass_weather_3_hours_json_1.default);
        const { body, status } = await global.testRequest
            .get('/forecast')
            .set({ 'x-access-token': token });
        expect(status).toBe(200);
        expect(body).toEqual(api_forecast_response_1_beach_json_1.default);
    });
    it('Should return 500 if something goes wrong during the processing', async () => {
        (0, nock_1.default)('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: () => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({ lat: -33.792726, lng: 151.289824 })
            .replyWithError('Something went wrong');
        const { status } = await global.testRequest
            .get('/forecast')
            .set({ 'x-access-token': token });
        expect(status).toBe(500);
    });
});
//# sourceMappingURL=forecast.test.js.map