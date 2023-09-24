import { User } from 'core/user/user.model';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User;
}
