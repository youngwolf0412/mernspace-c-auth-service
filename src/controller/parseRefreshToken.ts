import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { Request } from "express";
import { RefreshTokenCookie } from "../types";

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as RefreshTokenCookie;
    return refreshToken;
  },
});
