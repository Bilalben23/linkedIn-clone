import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn: "15m"
        }
    )
}


export const generateRefreshToken = (payload, rememberMe) => {
    return jwt.sign(
        payload,
        process.env.SECRET_REFRESH_TOKEN,
        {
            expiresIn: rememberMe ? "30d" : "7d"
        }
    )
}