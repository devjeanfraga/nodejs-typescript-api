import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json';
import { Forecast, Beach, BeachPosition } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Services', () => {
  it('Shoud return the forecast for a list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest
      .fn()
      .mockResolvedValue(stormGlassNormalizedResponseFixture);
    // mockando métodos por meio de prototype (substituindo o fetchPoints Method pelo method do jest);
    // Se como para acessar o método temo que dar o new na class
    // nesse caso podemos substituir o metodo fetchPoints sem acessar o new por meio do prototype
    // NÃO É UMA BOA PRÁTICA!!!

    const beaches: Beach[] = [
      {
        name: 'Manly',
        position: BeachPosition.E,
        lat: -33.792726,
        lng: 151.289824,
        user: 'some-id'
      }
    ];
    const expectedResponse = [
      {
        time: "2022-01-20T00:00:00+00:00",
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
            time: "2022-01-20T00:00:00+00:00",
            waveDirection: 86.93,
            waveHeight: 1.23,	
            windDirection: 61.49,
            windSpeed: 9.67	
          },
        ]
      },
      {
        time: "2022-01-20T01:00:00+00:00",
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 164.22,
            swellHeight:  0.32,
            swellPeriod:  11.62,
            time: "2022-01-20T01:00:00+00:00",
            waveDirection:  86.87,
            waveHeight:  1.19,
            windDirection:  58.57,
            windSpeed:  9.06
          },
        ]
      },
      {
        time: "2022-01-20T02:00:00+00:00",
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
            time: "2022-01-20T02:00:00+00:00",
            waveDirection: 86.82,
            waveHeight: 1.14,
            windDirection: 55.66,
            windSpeed: 8.46
          },
        ] 
      }

    ];

    const forecast = new Forecast(new StormGlass());
    const beachesWithRatings = await  forecast.processForecastForBeaches(beaches);
    expect(beachesWithRatings).toEqual(expectedResponse);
  });
});
