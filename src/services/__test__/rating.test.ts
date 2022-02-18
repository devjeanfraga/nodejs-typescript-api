import { BeachPosition, Beach } from "@src/models/beach";
import {Rating} from '@src/services/rating';

describe('Rating Services', ()=> {
  const defaultBeach = {
    lat: -22.890853,
    lng: -42.0369982,
    name: 'Praia do Forte',
    position: BeachPosition.S,
    user: 'Jean'
  };

  const deafaultRating = new Rating();
  
  describe('Calculate rating ofr a given point', () => {
    //Calcula todo Rating final 
  });

  describe('Get rating based on wind and on wave positions', () => {

    it('Should get Rating 1 for a beach with onshore winds', ()=> {
      //Deve pegar a pontuação 1 para praia com o vento a favor das ondas
      const rating = deafaultRating.getRatingBasedOnWindAndOnWavePosition(
        BeachPosition.S,
        BeachPosition.S
      );
      expect(rating).toBe(1); 
    });

    it('Should get Rating 3 for a beach with winds', ()=> {
      //Deve pegar a pontuação 3 para praia com o ventos cruzados
      const rating = deafaultRating.getRatingBasedOnWindAndOnWavePosition(
        BeachPosition.S,
        BeachPosition.S
      );
      expect(rating).toBe(3); 
    });

    it('Should get Rating 5 for a beach with offshore winds', ()=> {
      //Deve pegar a pontuação 5 para praia com o vento oposto da praia 
      const rating = deafaultRating.getRatingBasedOnWindAndOnWavePosition(
        BeachPosition.S,
        BeachPosition.S
      );
      expect(rating).toBe(5); 
    });    
    
  });
})