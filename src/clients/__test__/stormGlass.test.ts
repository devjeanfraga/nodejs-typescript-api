import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_weather_3_hours.json';
import stormGlassNormalized3hoursFixtures from '@test/fixtures/stormGlass_normalized_response_3_hours.json';

jest.mock("axios"); //jest inicializa com um require de axios;

describe('StormGlass Client', () => {
  it('Shoud return the normalize forecast from the StormGlass service', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;
    const axiosMocked = axios as jest.Mocked < typeof axios >;
    axiosMocked.get.mockResolvedValue({data: stormGlassWeather3HoursFixtures});

    const stormGlass = new  StormGlass(axios);
    const response = await  stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3hoursFixtures);
  })
})