import type { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/DB";
import { TokenEnum } from "../enums";

export interface ICredentials {
    user:HUserDocument;
    decoded: JwtPayload;
}

export interface IAuthRequest extends Request{
    credentials:ICredentials
    tokenType?:TokenEnum
}