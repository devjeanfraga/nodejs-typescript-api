//* ***PROTECTED*** */
// Significa que quem estender esta class poderá sobreescrever o método
// Esse método poderá ser usado dentro da classe mas não estará visível
// fora da class para ser usado deverá ser extendido.

import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/users';
import APIError, { IAPIError } from '@src/util/errors/api-error';
import { Response } from 'express';
import mongoose from 'mongoose';

export interface ResponseHandleError {
  code: number;
  erro: string;
}

export abstract class BaseController {
  protected sendCreatedUpdateDataResponse(
    res: Response,
    error: unknown
  ): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      return this.handleClientErrors(error, res);
    } else {
      //ADD ERROR BY PINO
      logger.error(error);
      return res
        .status(500)
        .send(APIError.format({ code: 500, message: 'Something went wrong' }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: IAPIError): Response {
    return res.status(apiError.code).send(APIError.format(apiError));
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError,
    res: Response
  ): Response {
    Object.values(error.errors).filter((err) => {
      err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED
        ? (res = res
            .status(409)
            .send(APIError.format({ code: 409, message: error.message })))
        : (res = res
            .status(400)
            .send(APIError.format({ code: 400, message: error.message })));
    });
    return res;
  }
}

//Object.values(error.errors).filter((err) => {
//err.name === 'ValidatorError' &&
//err.kind === CUSTOM_VALIDATION.DUPLICATED
//? (res = res.status(409).send({ code: 409, error: error.message }))
//: (res = res.status(422).send({ code: 422, error: error.message }));
//});
//return res

//const {code , erro } = this.handleClientErrors(error);
//return res
//.status(code)
//.send(erro);
