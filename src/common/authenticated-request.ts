import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  authUserEmail: string;
}
