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

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  // @Redirect('/', 301)
  async signup(
    @Body()
    body: SignupBodyDto,
  ): Promise<{
    message: string;
  }> {
    console.log({ body });
    await this.authenticationService.signup(body);

    return { message: 'done' };
  }

  @Post('resend-confirm-email')
  async resendConfirmEmail(
    @Body()
    body: ResendConfirmEmailDto,
  ): Promise<{
    message: string;
  }> {
    console.log({ body });
    await this.authenticationService.resendConfirmEmail(body);

    return { message: 'done' };
  }

  @Patch('confirm-email')
  async confirmEmail(
    @Body()
    body: ConfirmEmailDto,
  ): Promise<{
    message: string;
  }> {
    console.log({ body });
    await this.authenticationService.confirmEmail(body);

    return { message: 'done' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginBodyDto,
  ): Promise<LoginResponse> {
    const credentials = await this.authenticationService.login(body);
    return { message: 'done', data: { credentials } };
  }
}
