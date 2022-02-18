import cors from 'cors';
import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beache';
import { UsersController } from '@src/controllers/users';
import { Application } from 'express';
import * as database from '@src/util/database';
import logger from './logger';
import expressPino from 'express-pino-logger';


export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  //médoto para inicializar o servidor;
  public async init(): Promise<void> { 
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();

  }

  //cria o setup do Express ;
  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      expressPino({
        logger
      })
    );
    this.app.use(
      cors({
        origin: '*'
      })
    );
  }
  //cria o setup do Controllers ;
  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  public getApp(): Application {
    return this.app;
  }
  //cria o setup do DB ;
  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  //O close para fechar toda a nossa aplicação (boa prática);
  public async close(): Promise<void> {
    await database.close();
  }

  //Inicializar a applicação
  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port: ' + this.port );
    });
  }
}