const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_CODE || "secret";

const tokenGenerator = (data) => {
    const { id, username } = data;
    return jwt.sign({ id, username }, secret);
};

const tokenVerifier = (data) => {
    return jwt.verify(data, secret);
};

module.exports = { tokenGenerator, tokenVerifier };
