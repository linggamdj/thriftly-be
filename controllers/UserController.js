const { user } = require("../models");
const { encrypt, decrypt } = require("../helpers/bcrypt");
const { tokenGenerator, tokenVerifier } = require("../helpers/jsonwebtoken");

class UserController {
    static async getUserDetail(req, res) {
        try {
            const access_token = tokenVerifier(req.headers.access_token);

            const result = await user.findOne({
                where: { id: access_token.id },
            });

            res.status(200).json({
                status: "success",
                message: "User detail",
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;

            const getUser = await user.findOne({
                where: { username },
            });

            if (getUser) {
                if (decrypt(password, getUser.password)) {
                    let access_token = tokenGenerator(getUser);

                    res.status(200).json({
                        status: "success",
                        message: "Login success",
                        data: {
                            access_token: access_token,
                        },
                    });
                } else {
                    res.status(401).json({
                        status: "failed",
                        message: "Incorrect username or password",
                    });
                }
            } else {
                res.status(401).json({
                    status: "failed",
                    message: "Username doesn't exist",
                });
            }
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async register(req, res) {
        try {
            const { name, username } = req.body;

            const getUser = await user.findOne({
                where: { username },
            });

            if (!getUser) {
                const password = encrypt(req.body.password);

                const result = await user.create({
                    name,
                    username,
                    password,
                });

                res.status(201).json({
                    status: "success",
                    message: "Register success",
                    data: result,
                });
            } else {
                res.status(409).json({
                    status: "failed",
                    message: "Username has been used",
                });
            }
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async update(req, res) {
        try {
            let result;
            const access_token = tokenVerifier(req.headers.access_token);
            const { name, username } = req.body;

            const getUser = await user.findOne({
                where: { username },
            });

            if (!getUser || (getUser && getUser.id === access_token.id)) {
                if (req.file) {
                    result = await user.update(
                        {
                            name,
                            username,
                            profile_picture: `/public/uploads/${req.file.filename}`,
                        },
                        { where: { id: access_token.id } }
                    );
                } else {
                    result = await user.update(
                        { name, username },
                        { where: { id: access_token.id } }
                    );
                }

                result[0] === 1
                    ? res.status(200).json({
                          status: "success",
                          message: "User has been updated",
                      })
                    : res.status(404).json({
                          status: "failed",
                          message: "User not found",
                      });
            } else {
                res.status(409).json({
                    status: "failed",
                    message: "Username has been used",
                });
            }
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async updatePassword(req, res) {
        try {
            const access_token = tokenVerifier(req.headers.access_token);
            const password = encrypt(req.body.password);

            const result = await user.update(
                { password },
                { where: { id: access_token.id } }
            );

            result[0] === 1
                ? res.status(200).json({
                      status: "success",
                      message: "User's password has been updated",
                  })
                : res.status(404).json({
                      status: "failed",
                      message: "User not found",
                  });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }
}

module.exports = UserController;
