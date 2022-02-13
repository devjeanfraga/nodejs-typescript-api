import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import{ User }from '@src/models/users'

export interface DecodedUser extends Omit<User, '_id'> {
  id: string; 
}
export default class AuthServices {
  public static async hashPassword (
    password: string, 
    salt = 12
    ):Promise<string> {
  
    return bcrypt.hash(password, salt);
  }

  public static async  comparePasword(
  pasword: string, 
  hashedPassword: string
  ):Promise<boolean> {

  return await bcrypt.compare(pasword, hashedPassword);
  }

  public static  generateToken(payload: object): string {
    const token = jwt.sign(payload , config.get('app.auth.key') , {expiresIn: config.get('app.auth.tokenexpiresIn')});
    return token; 
  }

  public static decodeToken(token: string): DecodedUser {
   return  jwt.verify(token, config.get('app.auth.key')) as DecodedUser; 
  
  }

}