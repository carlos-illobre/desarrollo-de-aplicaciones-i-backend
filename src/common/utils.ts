import * as crypto from 'crypto';

export function generateOtp(): string {
  const otp = crypto.randomInt(100000, 1000000); // Generates a number between 100000 and 999999
  return otp.toString();
}
