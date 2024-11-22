import { Types } from "mongoose";

declare global {
  interface AuthUserInfo {
    sub: Types.ObjectId;
  }
  namespace Express {
    interface Request {
      user?: AuthUserInfo;
    }
  }
}

export {};
