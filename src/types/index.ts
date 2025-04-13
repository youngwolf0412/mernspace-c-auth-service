import { Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export type AuthCookie = { accessToken: string };

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;

    tenant: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
