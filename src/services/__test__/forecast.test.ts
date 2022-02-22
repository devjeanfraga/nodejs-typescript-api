import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json';
import { Forecast } from '../forecast';
import { ForecastProcessInternalError } from '@src/services/forecast';
import { Beach, GeoPosition } from '@src/models/beach';

jest.mock('@src/clients/stormGlass');

describe('Forecast Services', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it('Should return the forecast for a mutiple beaches in the same hour with different and ordered by ratings  ', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.69,
        time: '2022-01-20T02:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 315.48,
        windSpeed: 100,
      },
    ]);

    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 64.24,
        swellHeight: 0.15,
        swellPeriod: 13.89,
        time: '2022-01-20T02:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100,
      },
    ]);

    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 90.25,
        swellHeight: 18.05,
        swellPeriod: 15.0,
        time: '2022-01-20T02:00:00+00:00',
        waveDirection: 90.82,
        waveHeight: 1.14,
        windDirection: 270.66,
        windSpeed: 8.46,
      },
    ]);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Forte Sao Matheus',
        position: GeoPosition.N,
        user: 'fake-id',
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        user: 'fake-id',
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Dee Why',
        position: GeoPosition.W,
        user: 'fake-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2022-01-20T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Dee Why',
            position: 'W',
            rating: 4,
            swellDirection: 90.25,
            swellHeight: 18.05,
            swellPeriod: 15.0,
            time: '2022-01-20T02:00:00+00:00',
            waveDirection: 90.82,
            waveHeight: 1.14,
            windDirection: 270.66,
            windSpeed: 8.46,
          },
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 3,
            swellDirection: 64.24,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2022-01-20T02:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Forte Sao Matheus',
            position: 'N',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.69,
            time: '2022-01-20T02:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 315.48,
            windSpeed: 100,
          },
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('Shoud return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );
    const beaches: Beach[] = [
      {
        name: 'Manly',
        position: GeoPosition.E,
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
            rating: 3,
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
            rating: 3,
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
            rating: 3,
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

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRatings = await forecast.processForecastForBeaches(
      beaches
    );
    expect(beachesWithRatings).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it('Should throw internal Error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        name: 'Manly',
        position: GeoPosition.E,
        lat: -33.792726,
        lng: 151.289824,
        user: 'id-fake',
      },
    ];
    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );
    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessInternalError
    );
  });
});
