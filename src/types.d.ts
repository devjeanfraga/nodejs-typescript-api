//  .d.ts = "d" significa declarativo;
import * as http  from 'http';
import { DecodedUser }  from '@src/services/auth';

declare module 'express-server-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser;
  }
}