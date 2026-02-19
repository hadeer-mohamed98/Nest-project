import type { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from 'src/DB';
import { TokenEnum } from '../enums';
import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface IToken {
  _id?: Types.ObjectId;
  jti: string;
  expiredAt: Date;
  createdBy: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICredentials {
  user: HUserDocument;
  decoded: JwtPayload;
}

export interface IAuthRequest extends Request {
  credentials: ICredentials;
  tokenType?: TokenEnum;
}
