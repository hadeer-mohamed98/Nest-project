import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import {
  ConfirmEmailDto,
  LoginBodyDto,
  ResendConfirmEmailDto,
  SignupBodyDto,
} from './dto/auth.dto';
import { LoginResponse } from './entities/auth.entity';
import { IResponse, successResponse } from 'src/common';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  // @Redirect('/', 301)
  async signup(
    @Body()
    body: SignupBodyDto,
  ): Promise<IResponse> {
    console.log({ body });
    await this.authenticationService.signup(body);

    return successResponse();
  }

  @Post('resend-confirm-email')
  async resendConfirmEmail(
    @Body()
    body: ResendConfirmEmailDto,
  ): Promise<IResponse> {
    console.log({ body });
    await this.authenticationService.resendConfirmEmail(body);

    return successResponse();
  }

  @Patch('confirm-email')
  async confirmEmail(
    @Body()
    body: ConfirmEmailDto,
  ): Promise<IResponse> {
    console.log({ body });
    await this.authenticationService.confirmEmail(body);

    return successResponse();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBodyDto): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authenticationService.login(body);
    return successResponse<LoginResponse>({
      message: 'done',
      data: { credentials },
    });
  }
}
