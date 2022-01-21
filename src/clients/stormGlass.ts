import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string] : number; // a key seria a string "noaa" do response;
}

export interface StormGlassPoint {
  time: string;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight:	StormGlassPointSource;
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
  waveHeight:	number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  
  readonly stormGlassAPIParams = 'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor ( protected request: AxiosStatic ) {}

  //eslint-disable-next-line
  public async fetchPoints  (lat: number, lng: number): Promise<ForecastPoint[]> { 
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}=${lng}`,
    ); 
    
    return this.normalizeResponse(response.data);  

  }

  private normalizeResponse ( points:StormGlassForecastResponse ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map(point => ({
     
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight:	point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource]
    }))
  }

  private isValidPoint (point: Partial<StormGlassPoint>): boolean {
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