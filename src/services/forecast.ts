import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import logger from '@src/logger';
import { Beach } from '@src/models/beach';
import { InternalError } from '@src/util/errors/internal-error';
import { Rating } from './rating';
import _ from 'lodash'; // padrão pro lodashs er importado é em "_"

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
  constructor(
    //Passamos uma instancia da class para
    //possibilitar que futuramente outros
    //serviços possam ser aplicados ao Forecast
    protected stormGlass = new StormGlass(),

    // importa-se a classe em si para que
    // seja instaciada dentro de Forecast
    protected RatingService: typeof Rating = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map((t) => ({
        time: t.time,
        forecast: _.orderBy(t.forecast, ['rating'], ['desc']),
      }));
    } catch (error) {
      throw new ForecastProcessInternalError(
        (error as ForecastProcessInternalError).message
      );
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    logger.info(`Preparing the forecast for ${Beach.length} breach (s)`);
    const pointsWithCorrectSources: BeachForecast[] = []; //Array que vai receber as praias com suas previsões
    for (const beach of beaches) {
      const rating = new this.RatingService(beach);
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = this.enrichedBeachData(points, beach, rating);

      pointsWithCorrectSources.push(...enrichedBeachData);
    }
    return pointsWithCorrectSources;
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating
  ): BeachForecast[] {
    return points.map((point) => ({
      //Iremos fazer o marge do obj retornado do  stormGlass com o objeto beaches
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []; //cria um array vazio para receber os novos dados formatados;

    for (const point of forecast) {
      //loop onde point será o objeto de dados do forecast com o stormGlass;
      //verifico se forecastBytime Array tem algum valor de time igual ao forecast.time
      const timePoint = forecastByTime.find((f) => f.time === point.time);

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
