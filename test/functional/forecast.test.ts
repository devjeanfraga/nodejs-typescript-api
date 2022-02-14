//test de integração
import { Beach, BeachPosition } from '@src/models/beach';
import nock from 'nock';
import StormGlassWeather3HoursFixture from '@test/fixtures/stormGlass_weather_3_hours.json';
import ApiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beach.json';
import { User } from '@src/models/users';
import AuthServices from '@src/services/auth';

describe('Beach forecast fucntional', () => {
  const defaultUser = {
    name: "Saturno",
    email: "saturno@gmail",
    password: "saturno25"
  }

  let token: string;

  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});

    const defaultBeach = {
      name: 'Manly',
      position: BeachPosition.E,
      lat: -33.792726,
      lng: 151.289824,
    };
    new Beach(defaultBeach).save();
    const user = await new User(defaultUser).save();
    token = AuthServices.generateToken(user.toJSON());
    // O usuário deve ser em  
    // json para que seja um objeto
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
