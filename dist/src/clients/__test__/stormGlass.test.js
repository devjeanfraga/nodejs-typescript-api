"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stormGlass_1 = require("@src/clients/stormGlass");
const HTTPUtil = __importStar(require("@src/util/Request"));
const stormGlass_weather_3_hours_json_1 = __importDefault(require("@test/fixtures/stormGlass_weather_3_hours.json"));
const stormGlass_normalized_response_3_hours_json_1 = __importDefault(require("@test/fixtures/stormGlass_normalized_response_3_hours.json"));
jest.mock('@src/util/Request');
describe('StormGlass Client', () => {
    const MockedRequestClass = HTTPUtil.Request;
    const mockedRequest = new HTTPUtil.Request();
    it('Shoud return the normalize forecast from the StormGlass service', async () => {
        const lat = -22.8876102;
        const lng = -42.0173967;
        mockedRequest.get.mockResolvedValue({
            data: stormGlass_weather_3_hours_json_1.default,
        });
        const stormGlass = new stormGlass_1.StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlass_normalized_response_3_hours_json_1.default);
    });
    it('Shoud excluede incomplete data points', async () => {
        const lat = -22.8876102;
        const lng = -42.0173967;
        const imcompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2022-01-20T00:00:00+00:00',
                },
            ],
        };
        mockedRequest.get.mockResolvedValue({
            data: imcompleteResponse,
        });
        const stormGlass = new stormGlass_1.StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual([]);
    });
    it('shoud get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -22.8876102;
        const lng = -42.0173967;
        mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
        const stormGlass = new stormGlass_1.StormGlass(mockedRequest);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error when trying to communicate to StormGlass: Network Error');
    });
    it('Shoud get a StormGlassResponseError when the StormGlass service response with a error', async () => {
        const lat = -22.8876102;
        const lng = -42.0173967;
        class FakeAxiosError extends Error {
            constructor(response) {
                super();
                this.response = response;
            }
        }
        MockedRequestClass.isRequestError.mockReturnValue(true);
        mockedRequest.get.mockRejectedValue(new FakeAxiosError({
            status: 429,
            data: { errors: ['Rate Limit reached'] },
        }));
        const stormGlass = new stormGlass_1.StormGlass(mockedRequest);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(`Unexpected error returned by the stormGlass service: Error: {errors:[Rate Limit reached]} Code: 429`);
    });
});
//# sourceMappingURL=stormGlass.test.js.map