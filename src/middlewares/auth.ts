import AuthServices from '@src/services/auth';
import { NextFunction,Response, Request} from 'express';


export function authMiddleware (
  req: Partial<Request>, // Com o partial vc torna opcional todas as propriedadesdo Request  tendo que usar o "?" nas propriedades;
   _:Partial<Response>, // _ significa que nao será usado agora
  next: NextFunction):void {
  const token = req.headers?.['x-access-token'];
  const decode = AuthServices.decodeToken(token as string); //forçando o cast pra string;
  req.decoded = decode;
  next;
}