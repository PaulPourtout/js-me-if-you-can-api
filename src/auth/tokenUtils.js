const jwt = require("jsonwebtoken");

module.exports = {
    createToken: (payload, tokenExpiration) => {
        return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: tokenExpiration
        });
    },

    isAdmin: (req, res, next) => {
        if (req.decoded.admin) {
        next();
        } else {
        return res.status(401).json({
            success: false,
            message: "This route is admin only"
        });
        }
    },
    // Middleware to check token validity
    checkToken: (req, res, next) => {
        const token = req.headers["x-access-token"];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: "Failed to authenticate token" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }
    }
};
