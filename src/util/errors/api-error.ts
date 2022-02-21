import httpStatusCodes from 'http-status-codes';

//  ***Description*** para que possa passar talvez como resolver o erro.
//  Ou seguir alguma documentação para resolver o erro.
//  ***Documentation*** para que possa ser apondtada a documentação do 
//  erro explicando pq aquele erro acontece.
export interface IAPIError {
  message: string;
  code: number;
  codeAsString?: string; 
  description?: string; 
  documentation?: string; 
}

export interface APIErrorResponse extends Omit<IAPIError, 'codeAsString'> {
  error: string;
}

export default class APIError {
  public static format( error: IAPIError): APIErrorResponse {
    return {
      ...{
      message: error.message,
      code: error.code,
      error: error.codeAsString 
      ? error.codeAsString 
      : httpStatusCodes.getStatusText(error.code)
      },

      //Coloca os campor description e ou documente somente se "settarmos" eles; 
      ...(error.documentation && {documentation: error.documentation}),
      ...(error.description && { description: error.description })
    };
  }
}