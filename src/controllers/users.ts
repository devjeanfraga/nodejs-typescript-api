import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { User } from '../models/users';
import AuthServices from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateDataResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({
        code: 401,
        error: 'UNAUTHORIZED',
      });
    }
    if (!(await AuthServices.comparePasword(password, user.password))) {
      return res.status(401).send({
        code: 401,
        error: 'UNAUTHORIZED',
      });
    } else {
      
      const token = AuthServices.generateToken(user.toJSON());
      return res.status(200).send({ token: token });
    }
  }
}
