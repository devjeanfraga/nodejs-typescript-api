import AuthServices from '@src/services/auth';
import { NextFunction, Response, Request } from 'express';

export function authMiddleware(
  req: Partial<Request>, // Com o partial vc torna opcional todas as propriedadesdo Request  tendo que usar o "?" nas propriedades;
  res: Partial<Response>, // _ significa que nao será usado agora
  next: NextFunction
): void {
  try {
    const token = req.headers?.['x-access-token'];
    const decode = AuthServices.decodeToken(token as string); //forçando o cast pra string;
    req.decoded = decode;
    next();
  } catch (err) {
    res
      .status?.(401)
      .send({ code: 401, error: (err as Error).message });
  }
}
