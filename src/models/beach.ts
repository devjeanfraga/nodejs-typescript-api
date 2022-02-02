import mongoose, { Document, Model, Schema } from 'mongoose';

export enum BeachPosition { // Enum é um objeto key:value que facilita na hora de reusar as keys;
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;

}

const schema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    //formataçoes da transformaçao final dos dados, substituinbdo _id do mongoDB  por id
    //Em seguida deletando  ele (_id)
    //E deletando o campo __V;
    //Essa formatação é feita só na transformação final Não do banco de dados;
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//Aqui o omit é usado para omitir o _id de Beach que é opcional enquanto no
//Document do mongoose é obrigatório causando um overlap(Sobreposição)
//extendo o tipo Document terenmos acesso aos metódos dos mongoose;
interface BeacheModel extends Omit<Beach, '_id'>, Document {}
export const Beach: Model<BeacheModel> = mongoose.model('Beach', schema);
