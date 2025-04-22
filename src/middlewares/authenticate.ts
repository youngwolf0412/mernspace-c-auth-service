import { expressjwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import jwksClient from "jwks-rsa";
import { Config } from "../config";
import { AuthCookie } from "../types";

// expressjwt token ko verify karega or request me auth object add karega
// agar token valid hai to
export default expressjwt({
  // jwksClient to get the public key from the JWKS endpoint
  secret: jwksClient.expressJwtSecret({
    // ! iska matlab hai ki JWKS_URI pakka aa jayega, undefined nhi rahega
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  // getToken function to extract the token from the request
  // ye function token lega chahe token header me aaye ya cookie me aaye
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookie;
    // console.log("accessToken++++++++++++++", accessToken);
    return accessToken;
  },
});
