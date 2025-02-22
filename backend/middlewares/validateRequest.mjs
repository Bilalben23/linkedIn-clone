import { matchedData, validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        })
    }

    // only keep validated fields and remove extra fields
    req.body = matchedData(req, { locations: ["body"] })
    req.query = matchedData(req, { locations: ["query"] })
    req.params = matchedData(req, { locations: ["params"] })

    next()
}
