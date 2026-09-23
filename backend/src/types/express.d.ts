import type { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      appUser?: IUser;
    }
  }
}

export {};
