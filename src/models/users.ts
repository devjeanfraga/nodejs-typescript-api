import mongoose, { Document, Model  } from 'mongoose';
import AuthServices from '@src/services/auth';

// *** Criar o hash da password ***





export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED', //Se vc não colocar o operador '=' o enum vai de fato enumerar o valor, ex: 0, 1, 2, 3...
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
      },
    },
  }
).pre<UserModel>('save', async function (next): Promise<void> {
  if(!this.password || !this.isModified('password')) { // ?Não tem o campo ou ele nao foi modificado ! = Falsopois tem o campo e ele foi modificado
    return;
  } else {
    try{
      const passwordHash = await AuthServices.hashPassword(this.password);
      this.password = passwordHash
     
      next;
    }catch(error) {
      console.log(`Error hashing the password for the user ${this.name}`);
    }
  }

  
});

// ***Verificar se o email já existe*** 
// Schema personalizado para verificar se o campo existe no DB
// o validate do mongoose possui uma assinatura que permite inputar o type o error;
// basta dar um console.log no erro para verificar o campo kind.
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database',
  CUSTOM_VALIDATION.DUPLICATED
);
// Usando a async function para pegar o this do escopo local da function
// com o arrow function isso não é possivel
// a não ser que queira algo do escopo global;









export const User: Model<UserModel> = mongoose.model('User', schema);
