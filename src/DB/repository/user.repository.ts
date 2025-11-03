import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';
import { HUserDocument as TDocument, User } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel("User") protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
