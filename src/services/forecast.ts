import { ForecastPoint, StormGlass} from "@src/clients/stormGlass";

export enum BeachPosition { // Enum é um objeto key:value que facilita na hora de reusar as keys;
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
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

export class Forecast {
  //Passamos uma instancia da class para 
  //possibilitar que futuramente outros serviços possam ser aplicados ao Forecast
  constructor(protected stormGlass =  new StormGlass()) {}

  public async processForecastForBeaches(beaches:
     Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    for (const beach of beaches ) {
      const points  = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData =  points.map((e) => ({
        //Iremos fazer o marge do obj retornado do  stormGlass com o objeto beaches
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...e
      }));
      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectSources; 
  }
}