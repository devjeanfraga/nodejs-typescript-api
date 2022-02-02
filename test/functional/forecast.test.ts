//test de integração
import {Beach, BeachPosition} from '@src/models/beach';
import nock from 'nock';
import StormGlassWeather3HoursFixture from '@test/fixtures/stormGlass_weather_3_hours.json';

describe('Beach forecast fucntional', () => {
  beforeEach( async ()=> {
    await Beach.deleteMany({});
    const defaultBeach = {
      name: 'Manly',
      position: BeachPosition.E,
      lat: -33.792726,
      lng: 151.289824,
    }

    const beach = new Beach(defaultBeach);
    await beach.save();

  })
  it('should return a forecast with just a few times', async () => {

    /*** Nock ***/
    nock('https://api.stormglass.io:443', {
      encodedQueryParams:true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({'access-control-allow-origin': '*'})
      .get('/v2/weather/point')
      .query({
        lat: -33.792726,
        lng: 151.289824,
        params: /(.*)/,
        source: 'noaa'
      })
      .reply(200, StormGlassWeather3HoursFixture )
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    //Make sure we use toEqual to check value not the object and array itself
    expect(body).toEqual([
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
            }
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
              }
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
              }
            ]
          }
        ]);
  });
});
