import { SetupServer } from './server';
import config from 'config';

// O init() do setupServer retorna uma promise entao devemos dar um await
// o ideial seria usar o top-level-await mas esse projeto ainda não está configurado pra isso;
// então vamos fazer a funçao se auto invocar;
(async (): Promise<void> => {
  const server = new SetupServer(config.get('app.port'));
  await server.init();
  server.start();
})();
