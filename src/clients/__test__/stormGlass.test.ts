import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_weather_3_hours.json';
import stormGlassNormalized3hoursFixtures from '@test/fixtures/stormGlass_normalized_response_3_hours.json';

jest.mock("axios"); //jest inicializa com um require de axios;

describe('StormGlass Client', () => {
  const axiosMocked = axios as jest.Mocked < typeof axios >;
  it('Shoud return the normalize forecast from the StormGlass service', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;
    
    axiosMocked.get.mockResolvedValue({data: stormGlassWeather3HoursFixtures});

    const stormGlass = new  StormGlass(axios);
    const response = await  stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3hoursFixtures);
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
          time:"2022-01-20T00:00:00+00:00"
        },
      ],
    };

    axiosMocked.get.mockResolvedValue({data: imcompleteResponse});
    const stormGlass = new StormGlass(axiosMocked);
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual([]);

  });

  it('Deve retornar um erro do StormGlass service quando a request falhar antes de chegar ao serviço externo', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;

    axiosMocked.get.mockResolvedValue({message:'Network error'});
    const stormGlass = new StormGlass(axiosMocked);
    expect( await stormGlass.fetchPoints(lat, lng) ).rejects.toThrow(
      'Unexpected error when try to comunicate with the StormGlass Service: Network error'
    );
  })
});