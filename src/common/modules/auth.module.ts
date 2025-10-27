import { Global, Module } from '@nestjs/common';
import { TokenModel, UserModel } from 'src/DB';
import { TokenRepository, UserRepository } from 'src/DB/repository';
import { TokenService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [UserModel, TokenModel],
  controllers: [],
  providers: [UserRepository, JwtService, TokenService, TokenRepository],
  exports: [
    UserRepository,
    JwtService,
    TokenService,
    TokenRepository,
    UserModel,
    TokenModel,
  ],
})
export class SharedAuthenticationModule {}
