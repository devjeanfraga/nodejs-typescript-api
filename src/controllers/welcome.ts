import {Get, Controller } from "@overnightjs/core";
import { Request, Response } from 'express';


@Controller('')
export  class Welcome {
  @Get('')
  public async home(_: Request, res: Response ): Promise<void> {
    res.status(200).send({"message": "Welcome to forecast-API"})  
  }
}