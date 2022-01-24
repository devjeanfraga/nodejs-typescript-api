import { StormGlass } from '@src/clients/stormGlass';
import * as HTTPUtil from '@src/util/Request';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_weather_3_hours.json';
import stormGlassNormalized3hoursFixtures from '@test/fixtures/stormGlass_normalized_response_3_hours.json';

jest.mock('@src/util/Request'); //jest inicializa com um require de axios;

describe('StormGlass Client', () => {

  const MockedRequestClass = HTTPUtil.Request as jest.Mocked< typeof HTTPUtil.Request> //Aqui se usa typeof pq queremos a class em sim nao uma instancia dela
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request> //Aqui nao se usa typeof pq é uma instancia nbão é stático

  it('Shoud return the normalize forecast from the StormGlass service', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixtures,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
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
          time: '2022-01-20T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({ data: imcompleteResponse } as HTTPUtil.Response);
    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  //Deve retornar um erro do StormGlass service quando a request falhar antes de chegar ao serviço externo
  it('shoud get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('Shoud get a StormGlassResponseError when the StormGlass service response with a error', async () => {
    const lat = -22.8876102;
    const lng = -42.0173967;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      })
    );

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      `Unexpected error returned by the stormGlass service: Error: {errors:[Rate Limit reached]} Code: 429`
    );
  });
});
