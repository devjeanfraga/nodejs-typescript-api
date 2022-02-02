import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beache';
import { Application } from 'express';
import * as database from '@src/util/database';

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
  }
  //cria o setup do Controllers ;
  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }
  //cria o setup do DB ;
  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  //O close para fechar toda a nossa aplicação (boa prática);
  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
