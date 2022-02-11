//* ***PROTECTED*** */
// Significa que quem estender esta class poderá sobreescrever o método
// Esse método poderá ser usado dentro da classe mas não estará visível
// fora da class para ser usado deverá ser extendido.

import { CUSTOM_VALIDATION } from '@src/models/users';
import { Response } from 'express';
import mongoose from 'mongoose';



export abstract class BaseController {
  protected sendCreatedUpdateDataResponse(
    res: Response,
    error: unknown
  ): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      this.handleClientErrors(error , res);
      return res;
              
    } else {
      return res.status(500).send({ code: 500, error: 'Something went wrong' });
    }
  }

  private handleClientErrors (error: mongoose.Error.ValidationError , res: Response): Response {
    
    Object.values(error.errors).filter((err)=> {
      err.name ==='ValidatorError' &&
      err.kind === CUSTOM_VALIDATION.DUPLICATED
        ? res = res.status(409).send({ code: 409, error: error.message })
        : res = res.status(422).send({ code: 422, error: error.message });
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