import { Types } from "mongoose";
import { GenderEnum, LanguageEnum, ProviderEnum, RoleEnum } from "../enums";
import { OtpDocument } from "src/DB";

export interface IUser {
  // username: string;
  // email: string;
  // password: string;
  // id: number;
  _id?:Types.ObjectId;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  confirmEmail?: Date;
  confirmedAt?: Date;
  password?: string;
  provider: ProviderEnum;
  role: RoleEnum;
  gender: GenderEnum;
  preferredLanguage: LanguageEnum;
  changeCredentialsTime?: Date;
  otp?:OtpDocument[]
  profilePicture?:string;

  createdAt?:Date;
  updatedAt?:Date;




}
