import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beach';
import { authMiddleware } from '@src/middlewares/auth';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beach = await Beach.find({ user: req.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beach);

      res.status(200).send(forecastData);
    } catch (error) {
      res.status(500).send({ error: 'somethings went wrong' });
    }
  }
}
