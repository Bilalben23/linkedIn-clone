import passport from "passport"

export const authenticateJWT = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error when authenticating"
            })
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        req.user = user;
        next()
    })(req, res, next)
}