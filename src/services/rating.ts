import {Beach, BeachPosition} from '@src/models/beach'

export class Rating {
  //constructor (private beach = Beach){}

  public getRatingBasedOnWindAndOnWavePosition(wavePosition: BeachPosition, windPosition: BeachPosition): number {
    if(wavePosition === windPosition) {
      return 1;
    }
    return 3;
  }

}