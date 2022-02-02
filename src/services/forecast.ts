import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/internal-error';

export enum BeachPosition { // Enum é um objeto key:value que facilita na hora de reusar as keys;
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

//Omit irá omitir o campo user do Beach
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  //Passamos uma instancia da class para
  //possibilitar que futuramente outros serviços possam ser aplicados ao Forecast
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessInternalError(
        (error as ForecastProcessInternalError).message
      );
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      //Iremos fazer o marge do obj retornado do  stormGlass com o objeto beaches
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []; //cria um array vazio para receber os novos dados formatados;

    for (const point of forecast) {
      //loop onde point será o objeto de dados do forecast com o stormGlass;
      const timePoint = forecastByTime.find((f) => f.time === point.time); //verifico se forecastBytime Array tem algum valor de time igual ao forecast.time

      if (timePoint) {
        timePoint.forecast.push(point); //caso a premissa anterior seja verdadeira damos um push do forecast na key forecast
      } else {
        forecastByTime.push({
          //se não damos um push e criamos o agrupamento by time;
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
