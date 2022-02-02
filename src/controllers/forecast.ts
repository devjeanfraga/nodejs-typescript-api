import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beach';

const forecast = new Forecast();

@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(_: Request, res: Response): Promise<void> {
    try {
      const beach = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beach);

      res.status(200).send(forecastData); 
    } catch (error) {
      res.status(500).send({error: "somethings went wrong"})
    }
  }
}
