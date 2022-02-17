import { InternalError } from '@src/util/internal-error';
import * as HTTPUtil from '@src/util/Request';
import { IConfig } from 'config';
import config from 'config/';

export interface StormGlassPointSource {
  [key: string]: number; // a key seria a string "noaa" do response;
}

export interface StormGlassPoint {
  time: string;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const InternalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${InternalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const InternalMessage =
      'Unexpected error returned by the stormGlass service';
    super(`${InternalMessage}: ${message}`);
  }
}

//Config
const stormGlassRessourceConfig: IConfig = config.get(
  'app.resources.StormGlass'
);

//MAIN CLASS
export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `${stormGlassRessourceConfig.get(
          'apiURL'
        )}/weather/point?lat=${lat}&lng=${lng}&params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: stormGlassRessourceConfig.get('apiToken'),
          },
        }
      );

      return this.normalizeResponse(response.data);
      //eslint-disable-next-line
    } catch (err: any) { 

      if (HTTPUtil.Request.isRequestError(err)) {
        const dataError = JSON.stringify(err.response.data).replace(/["]/g, '');
        const codeError = err.response.status;
        throw new StormGlassResponseError(
          `Error: ${dataError} Code: ${codeError}`
        );
      }
      //throw new Error(`Unexpected error when trying to communicate to StormGlass: ${(err as Error).message}`);
      throw new ClientRequestError((err as { message: any }).message); //eslint-disable-line
    }
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    //O exclamaçao dupla garante que o retorno deve ser um boolean;
    return !!(
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.time &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
