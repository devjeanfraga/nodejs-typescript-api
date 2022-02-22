import { ForecastPoint } from '@src/clients/stormGlass';
import { Beach, GeoPosition } from '@src/models/beach';

//Estrutura de dados para referenciar as alturas e nao deixar
// número pulverizados pelo algoritmo
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHight: {
    min: 1.0,
    max: 2.0,
  },
  headHight: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndOnWavePosition(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const sweelPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + sweelPeriodRating) / 3;

    return Math.round(finalRating);
  }

  public getRatingBasedOnWindAndOnWavePosition(
    wavePosition: GeoPosition,
    windPosition: GeoPosition
  ): number {
    if (wavePosition === windPosition) {
      //onshore
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      //offshore
      return 5;
    }
    //cross wind
    return 3;
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    ) {
      return 2;
    }
    if (
      height >= waveHeights.waistHight.min &&
      height < waveHeights.waistHight.max
    ) {
      return 3;
    }
    if (height >= waveHeights.headHight.min) {
      return 5;
    }

    return 1;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }
    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    }
    return 1;
  }

  public getPositionFromLocation(cordinates: number): GeoPosition {
    if (cordinates > 315 || (cordinates <= 45 && cordinates >= 0)) {
      return GeoPosition.N;
    }
    if (cordinates > 45 && cordinates <= 135) {
      return GeoPosition.E;
    }
    if (cordinates > 135 && cordinates <= 255) {
      return GeoPosition.S;
    }

    return GeoPosition.W;
  }

  // O is no inicio dos metodos indica um boolean
  // Método para saber a prosição da praia
  private isWindOffShore(
    waveDirection: GeoPosition,
    windDirection: GeoPosition
  ): boolean {
    const result =
      //check norte
      (waveDirection === GeoPosition.N &&
        windDirection === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      //check Sul
      (waveDirection === GeoPosition.S &&
        windDirection === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      //check Leste
      (waveDirection === GeoPosition.E &&
        windDirection === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      //check Oeste
      (waveDirection === GeoPosition.W &&
        windDirection === GeoPosition.E &&
        this.beach.position === GeoPosition.W);
    //console.log(result);
    return result;
  }
}
