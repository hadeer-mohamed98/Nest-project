import { OtpRepository } from './../../DB/repository/otp.repository';
import { UserRepository } from './../../DB/repository/user.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createNumericalOtp,
  generateHash,
  IUser,
  LoginCredentialsResponse,
  OtpEnum,
  ProviderEnum,
} from 'src/common';
import {
  SignupBodyDto,
  ResendConfirmEmailDto,
  ConfirmEmailDto,
  LoginBodyDto,
} from './dto/auth.dto';
import { Types } from 'mongoose';
import { SecurityService, TokenService } from 'src/common/services';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { HUserDocument } from 'src/DB';

@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly securityService: SecurityService,
    private readonly tokenService: TokenService,
  ) {}

  private async createConfirmEmailOtp(userId: Types.ObjectId) {
    await this.otpRepository.create({
      data: [
        {
          code: createNumericalOtp(),
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          type: OtpEnum.ConfirmEmail,
        },
      ],
    });
  }

  async signup(data: SignupBodyDto): Promise<string> {
    const { email, password, username } = data;
    const checkUserExist = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExist) {
      throw new ConflictException('Email already exist!');
    }
    const [user] = await this.userRepository.create({
      data: [{ username, email, password: await generateHash(password) }],
    });
    if (!user) {
      throw new BadRequestException(
        'Fail to signup this account please try again later',
      );
    }

    await this.createConfirmEmailOtp(user._id);
    return 'done';
  }

  async resendConfirmEmail(data: ResendConfirmEmailDto): Promise<string> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching account');
    }
    if (user.otp?.length) {
      throw new ConflictException(
        `sorry we cant grant you new OTP until the existing one become expired please try again after : ${user.otp[0].expiredAt}`,
      );
    }
    await this.createConfirmEmailOtp(user._id);
    return 'done';
  }

  async confirmEmail(data: ConfirmEmailDto): Promise<string> {
    const { email, code } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching account');
    }
    if (
      !user.otp?.length &&
      (await this.securityService.compareHash(code, user.otp[0].code))
    ) {
      throw new BadRequestException('invalid otp');
    }

    user.confirmedAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({ filter: { _id: user.otp[0]._id } });
    return 'done';
  }

  async login(
    data: LoginBodyDto,
  ): Promise<LoginCredentialsResponse> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: ProviderEnum.SYSTEM,
      },
    });
    if (!user) {
      throw new NotFoundException('Fail to find matching account');
    }
    if (!(await this.securityService.compareHash(password, user.password))) {
      throw new NotFoundException('Fail to find matching account');
    }
   

    return await this.tokenService.createLoginCredentials(user as HUserDocument);
  }
}
