//test de integração
import { Beach, BeachPosition } from '@src/models/beach';
import nock from 'nock';
import StormGlassWeather3HoursFixture from '@test/fixtures/stormGlass_weather_3_hours.json';
import ApiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beach.json';

describe('Beach forecast fucntional', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});
    const defaultBeach = {
      name: 'Manly',
      position: BeachPosition.E,
      lat: -33.792726,
      lng: 151.289824,
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    /*** Nock ***/
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
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
      .reply(200, StormGlassWeather3HoursFixture);
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    //Make sure we use toEqual to check value not the object and array itself
    expect(body).toEqual(ApiForecastResponse1BeachFixture);
  });

  it('Should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({ lat: -33.792726, lng: 151.289824 })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');
    expect(status).toBe(500);
  });
});
