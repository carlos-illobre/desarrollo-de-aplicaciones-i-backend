import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InMemoryCache } from 'src/common/cache/inMemoryCache';
import { generateOtp } from 'src/common/utils';

const DEFAULT_TTL = '600000'; // 10 minutes
const SIGNUP_PREFIX = 'signup_';
const PASSWORD_RESET_PREFIX = 'password_reset_';

type OtpType = 'SIGNUP' | 'PASSWORD_RESET';

type UserData = {
  email: string;
  fullName: string;
  password: string;
};

@Injectable()
export class OtpRepository {
  constructor(private readonly cacheService: InMemoryCache) {}

  private getKey(otp: string, type: OtpType): string {
    const prefix = type === 'SIGNUP' ? SIGNUP_PREFIX : PASSWORD_RESET_PREFIX;
    return `${prefix}${otp}`;
  }

  createUserDataOtp(
    email: string,
    password: string,
    type: OtpType,
    fullName?: string,
  ): string {
    let otp: string;
    do {
      otp = generateOtp();
    } while (this.cacheService.has(this.getKey(otp, type)));

    this.cacheService.set(
      this.getKey(otp, type),
      { email, fullName, password },
      Number.parseInt(process.env.SIGNUP_OTP_TTL ?? DEFAULT_TTL),
    );
    return otp;
  }

  getUserDataByOtp(otp: string, type: OtpType): UserData {
    const userData = this.cacheService.get(this.getKey(otp, type)) as UserData;
    if (!userData) {
      throw new BadRequestException();
    }
    return userData;
  }

  deleteOtp(otp: string, type: OtpType): void {
    this.cacheService.delete(this.getKey(otp, type));
  }
}
