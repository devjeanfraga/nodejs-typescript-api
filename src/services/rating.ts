import {Beach, BeachPosition} from '@src/models/beach'

//Estrutura de dados para referenciar as alturas e nao deixar
// número pulverizados pelo algoritmo 
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHight: {
    min: 1.0,
    max: 2.0
  },
  headHight: {
    min: 2.0,
    max: 2.5
  },
};

export class Rating {
  constructor (private beach: Beach){}

  public getRatingBasedOnWindAndOnWavePosition(wavePosition: BeachPosition, windPosition: BeachPosition): number {
    if(wavePosition === windPosition) {
      //onshore
      return 1;
    } else if(this.isWindOffShore(wavePosition, windPosition)) {
      //offshore
      return 5;
    }
    //cross wind
    return 3; 
  }

  public getRatingForSwellSize(height: number ):number {
    if(
      height >= waveHeights.ankleToKnee.min && 
      height < waveHeights.ankleToKnee.max
      ) {
      return 2;
    }
    if(
      height >= waveHeights.waistHight.min && 
      height < waveHeights.waistHight.max
      ) {
      return 3;
    }
    if(height >= waveHeights.headHight.min) {
      return 5;
    }

    return 1;
  }

  public getRatingForSwellPeriod(period: number):number {
    if( period >= 7 && period < 10 ) {
      return 2
    }
    if( period >= 10 && period < 14 ) {
      return 4
    }
    if( period >= 14 ) {
      return 5
    }
    return 1;
  }

  public getPositionFromLocation(cordinates: number ):BeachPosition {
    if( cordinates > 315 || (cordinates <= 45 && cordinates >= 0)) {
      return BeachPosition.N;
    }
    if(cordinates > 45 && cordinates <= 135 ) {
      return BeachPosition.E
    }
    if( cordinates > 135 && cordinates <= 255 ) {
      return BeachPosition.S
    }
    
    return BeachPosition.W
  }

  // O is no inicio dos metodos indica um boolean
  // Método para saber a prosição da praia
  private isWindOffShore(waveDirection: BeachPosition, windDirection: BeachPosition): boolean {
   const result =  (
      //check norte 
      ( waveDirection === BeachPosition.N &&
        windDirection === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      //check Sul
      ( waveDirection === BeachPosition.S &&
        windDirection === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      //check Leste
      ( waveDirection === BeachPosition.E &&
        windDirection === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      //check Oeste
      ( waveDirection === BeachPosition.W &&
        windDirection === BeachPosition.E &&
        this.beach.position === BeachPosition.W)  
    )
    console.log(result);
    return result 
  }



}