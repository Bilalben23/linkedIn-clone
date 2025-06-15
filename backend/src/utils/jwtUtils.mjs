import jwt from "jsonwebtoken";
import { ENV_VARS } from "../configs/enVars.mjs";

export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        ENV_VARS.SECRET_ACCESS_TOKEN,
        {
            expiresIn: "15m"
        }
    )
}


export const generateRefreshToken = (payload, rememberMe) => {
    return jwt.sign(
        payload,
        ENV_VARS.SECRET_REFRESH_TOKEN,
        {
            expiresIn: rememberMe ? "30d" : "7d"
        }
    )
}