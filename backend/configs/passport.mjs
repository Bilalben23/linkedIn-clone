import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import { User } from "../models/userModel.mjs";


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_ACCESS_TOKEN
}


export const configurePassport = () => {
    passport.use(
        new JWTStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.id).select("name username email profilePicture headline");
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (err) {
                done(err, false);
            }
        })
    )
}