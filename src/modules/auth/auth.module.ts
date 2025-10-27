import { AuthenticationController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { OtpModel } from 'src/DB';
import { OtpRepository } from 'src/DB/repository';
import { SecurityService } from 'src/common/services';


@Module({
  imports: [ OtpModel],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, OtpRepository, SecurityService],
  exports: [],
})
export class AuthenticationModule {}
