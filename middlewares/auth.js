const { tokenVerifier } = require("../helpers/jsonwebtoken");

const auth = (req, res, next) => {
    const access_token = req.headers.access_token;

    if (access_token) {
        try {
            const verify_token = tokenVerifier(access_token);
            req.userData = verify_token;
            next();
        } catch (err) {
            res.status(401).json({
                status: "failed",
                message: "Unauthenticated",
            });
        }
    } else {
        res.status(401).json({
            status: "failed",
            message: "Access token not found!",
        });
    }
};

module.exports = { auth };
