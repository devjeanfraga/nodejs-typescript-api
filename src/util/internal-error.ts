export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name; //Para caso alguém tente debugar essa class. Assim verá o nome dela;
    Error.captureStackTrace(this, this.constructor);
    // Boa pratica para omitir detalhes de implementação da geração de erros do usuário.
  }
}
