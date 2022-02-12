import bcrypt from 'bcrypt';

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
}