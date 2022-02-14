"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stormGlass_1 = require("@src/clients/stormGlass");
const stormGlass_normalized_response_3_hours_json_1 = __importDefault(require("@test/fixtures/stormGlass_normalized_response_3_hours.json"));
const forecast_1 = require("../forecast");
const forecast_2 = require("@src/services/forecast");
const beach_1 = require("@src/models/beach");
jest.mock('@src/clients/stormGlass');
describe('Forecast Services', () => {
    const mockedStormGlassSErvice = new stormGlass_1.StormGlass();
    it('Shoud return the forecast for a list of beaches', async () => {
        mockedStormGlassSErvice
            .fetchPoints.mockResolvedValue(stormGlass_normalized_response_3_hours_json_1.default);
        const beaches = [
            {
                name: 'Manly',
                position: beach_1.BeachPosition.E,
                lat: -33.792726,
                lng: 151.289824,
                user: 'id-fake',
            },
        ];
        const expectedResponse = [
            {
                time: '2022-01-20T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 164.19,
                        swellHeight: 0.31,
                        swellPeriod: 11.69,
                        time: '2022-01-20T00:00:00+00:00',
                        waveDirection: 86.93,
                        waveHeight: 1.23,
                        windDirection: 61.49,
                        windSpeed: 9.67,
                    },
                ],
            },
            {
                time: '2022-01-20T01:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 164.22,
                        swellHeight: 0.32,
                        swellPeriod: 11.62,
                        time: '2022-01-20T01:00:00+00:00',
                        waveDirection: 86.87,
                        waveHeight: 1.19,
                        windDirection: 58.57,
                        windSpeed: 9.06,
                    },
                ],
            },
            {
                time: '2022-01-20T02:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 164.24,
                        swellHeight: 0.32,
                        swellPeriod: 11.55,
                        time: '2022-01-20T02:00:00+00:00',
                        waveDirection: 86.82,
                        waveHeight: 1.14,
                        windDirection: 55.66,
                        windSpeed: 8.46,
                    },
                ],
            },
        ];
        const forecast = new forecast_1.Forecast(mockedStormGlassSErvice);
        const beachesWithRatings = await forecast.processForecastForBeaches(beaches);
        expect(beachesWithRatings).toEqual(expectedResponse);
    });
    it('should return an empty list when the beaches array is empty', async () => {
        const forecast = new forecast_1.Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });
    it('Should throw internal Error when something goes wrong during the rating process', async () => {
        const beaches = [
            {
                name: 'Manly',
                position: beach_1.BeachPosition.E,
                lat: -33.792726,
                lng: 151.289824,
                user: 'id-fake',
            },
        ];
        mockedStormGlassSErvice.fetchPoints.mockRejectedValue('Error fetching data');
        const forecast = new forecast_1.Forecast(mockedStormGlassSErvice);
        await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(forecast_2.ForecastProcessInternalError);
    });
});
//# sourceMappingURL=forcast.test.js.map