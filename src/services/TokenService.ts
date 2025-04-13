import fs from "fs";
import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import path from "path";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/privateKey.pem"),
      );
    } catch (err) {
      const error = createHttpError(500, "Error reading private key file");
      throw error;
    }
    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });
    return accessToken;
  }
  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }
  async persistRefreshToken(user: User) {
    const MS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365;
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    const newRefreshToken = await refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_A_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId: number) {
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    return await refreshTokenRepository.delete({ id: tokenId });
  }
}
