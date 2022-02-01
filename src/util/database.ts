import config, {IConfig} from 'config';
import {connect as mongooseConnect ,connection} from 'mongoose';

const dbConfig: IConfig = config.get('app.database');

export const connect = async (): Promise<void> => {
  await mongooseConnect(dbConfig.get('mongoURL'));
};

export const close = (): Promise<void> => connection.close();
//Boa prática finalizar o banco de dados antes 
// de finalizar a app pra garantir que nao crie nenhuma inconsistência




