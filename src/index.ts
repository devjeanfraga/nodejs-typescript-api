import { SetupServer } from './server';
import config from 'config';
import logger from './logger';
import process from 'process';

enum ExitStatus {
  Failure = 1,
  Success = 0
}


//  Escuta todas as promises que receberam reject mas que nao tiveram Catch
//  Jogamnos uma exceção que vai finalizar o processo e seguramente em seguida o 
//  App reiniica( Tem custo baixo para ser reinicializada). Melhor que ficar
//  enternamente. 
process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to uncaught promise: ${promise} and ${reason}`
  );

  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting due to an uncaught exception ${error}`)
  process.exit(ExitStatus.Failure);
});
// O init() do setupServer retorna uma promise entao devemos dar um await
// o ideial seria usar o top-level-await mas esse projeto ainda não está configurado pra isso;
// então vamos fazer a funçao se auto invocar;
(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('app.port'));
    await server.init();
    server.start();

    // *** Graceful shutdown ***
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.map( (sig )=> {
      process.on( sig , async () => {
        try {
          await server.close();
          console.log("App exit with success");
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error('App exit with error: ' + error);
          process.exit(ExitStatus.Failure);
        }
      });
    });
  } catch (error) {
    logger.error(`App exit with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
