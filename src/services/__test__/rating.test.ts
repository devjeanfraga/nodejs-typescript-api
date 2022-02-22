import { GeoPosition } from '@src/models/beach';
import { Rating } from '@src/services/rating';

describe('Rating Services', () => {
  const defaultBeach = {
    lat: -22.890853,
    lng: -42.0369982,
    name: 'Praia do Forte',
    position: GeoPosition.E,
    user: 'Jean',
  };

  const defaultRating = new Rating(defaultBeach);

  describe('Calculate rating ofr a given point', () => {
    const defaultPoint = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100,
    };

    it('Should return a rating less than 1 for a poor point', () => {
      const rating = defaultRating.getRateForPoint(defaultPoint);
      expect(rating).toBe(1);
    });

    it('Should get a rating of 3 for a point with offshore winds and a half overhead heightt', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 0.7,
          windDirection: 256,
        },
      };
      const rating = defaultRating.getRateForPoint(point);
      expect(rating).toBe(3);
    });

    it('should get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 0.7,
          swellPeriod: 12,
          windDirection: 257,
        },
      };
      const rating = defaultRating.getRateForPoint(point);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 classic day!', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 2.5,
          swellPeriod: 16,
          windDirection: 259,
        },
      };
      const rating = defaultRating.getRateForPoint(point);
      expect(rating).toBe(5);
    });
  });

  /**
   * Wave and wind only tests
   */
  describe('Get rating based on wind and on wave positions', () => {
    it('Should get Rating 1 for a beach with onshore winds', () => {
      //Deve pegar a pontuação 1 para praia com o vento a favor das ondas
      const rating = defaultRating.getRatingBasedOnWindAndOnWavePosition(
        GeoPosition.S,
        GeoPosition.S
      );
      expect(rating).toBe(1);
    });

    it('Should get Rating 3 for a beach with winds', () => {
      //Deve pegar a pontuação 3 para praia com o ventos cruzados
      const rating = defaultRating.getRatingBasedOnWindAndOnWavePosition(
        GeoPosition.E,
        GeoPosition.S
      );
      expect(rating).toBe(3);
    });

    it('Should get Rating 5 for a beach with offshore winds', () => {
      //Deve pegar a pontuação 5 para praia com o vento oposto da praia
      const rating = defaultRating.getRatingBasedOnWindAndOnWavePosition(
        GeoPosition.E,
        GeoPosition.W
      );
      expect(rating).toBe(5);
    });
  });

  /**
   * Period calculation only tests
   */
  describe('Get rating based on swell period', () => {
    it('should get a rating of 1 for a period of 5 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);
      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for a period of 9 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);
      expect(rating).toBe(2);
    });

    it('should get a rating of 4 for a period of 12 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for a period of 16 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);
      expect(rating).toBe(5);
    });
  });

  /**
   * Swell height specific logic calculation
   */
  describe('Get rating based on swell height', () => {
    it('should get rating 1 for less than ankle to knee high swell', () => {
      // retorna 1 se a onda for menor da altura do joelho até o tornozelo
      const rating = defaultRating.getRatingForSwellSize(0.2);
      expect(rating).toBe(1);
    });
    it('should get rating 2 for an ankle to knee swell', () => {
      //retorna 2 se for até a altura do joelho
      const rating = defaultRating.getRatingForSwellSize(0.6);
      expect(rating).toBe(2);
    });

    it('should get rating 3 for waist high swell', () => {
      // se for até a cintura
      const rating = defaultRating.getRatingForSwellSize(1.5);
      expect(rating).toBe(3);
    });

    it('should get rating 5 for overhead swell', () => {
      // se passar da cabeça
      const rating = defaultRating.getRatingForSwellSize(2.5);
      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific calculation
   */
  describe('Get position based on points location', () => {
    it('should get the point based on a east location', () => {
      const response = defaultRating.getPositionFromLocation(92);
      expect(response).toBe(GeoPosition.E);
    });

    it('should get the point based on a north location 1', () => {
      const response = defaultRating.getPositionFromLocation(360);
      expect(response).toBe(GeoPosition.N);
    });

    it('should get the point based on a north location 2', () => {
      const response = defaultRating.getPositionFromLocation(40);
      expect(response).toBe(GeoPosition.N);
    });

    it('should get the point based on a south location', () => {
      const response = defaultRating.getPositionFromLocation(200);
      expect(response).toBe(GeoPosition.S);
    });

    it('should get the point based on a west location', () => {
      const response = defaultRating.getPositionFromLocation(300);
      expect(response).toBe(GeoPosition.W);
    });
  });
});
