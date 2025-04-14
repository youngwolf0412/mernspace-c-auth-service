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
export type RefreshTokenCookie = { refreshToken: string };

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
    tenant: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IRefreshTokenPayload {
  id: string;
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreateTenantRequest extends Request {
  body: ITenant;
}

export interface TenantQueryParams {
  q: string;
  perPage: number;
  currentPage: number;
}
