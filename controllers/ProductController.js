const { product } = require("../models");

class ProductController {
    static async getProducts(req, res) {
        try {
            const result = await product.findAll();

            res.status(200).json({
                status: "success",
                message: "All Products",
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const id = +req.params.id;

            const result = await product.findOne({ where: { id: id } });

            res.status(200).json({
                status: "success",
                message: `Product with id ${id}`,
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async add(req, res) {
        try {
            let result;
            const { name, new_price, second_price, stock } = req.body;

            const duplicate = await product.findOne({
                where: { name: name.toLowerCase() },
            });

            if (duplicate) {
                res.status(403).json({
                    status: "failed",
                    message: `${name} has already exists!`,
                });
            } else {
                if (req.file) {
                    result = await product.create({
                        name: name.toLowerCase(),
                        new_price,
                        second_price,
                        stock,
                        image: `/public/uploads/${req.file.filename}`,
                    });
                } else {
                    result = await product.create({
                        name: name.toLowerCase(),
                        new_price,
                        second_price,
                        stock,
                        image: null,
                    });
                }

                res.status(200).json({
                    status: "success",
                    message: "Product has been added!",
                    data: result,
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
            const id = +req.params.id;
            const { name, new_price, second_price, stock } = req.body;

            if (req.file) {
                result = await product.update(
                    {
                        name: name.toLowerCase(),
                        new_price,
                        second_price,
                        stock,
                        image: `/public/uploads/${req.file.filename}`,
                    },
                    { where: { id } }
                );
            } else {
                result = await product.update(
                    {
                        name: name.toLowerCase(),
                        new_price,
                        second_price,
                        stock,
                    },
                    { where: { id } }
                );
            }

            result[0] === 1
                ? res.status(200).json({
                      status: "success",
                      message: "Product has been updated!",
                  })
                : res.status(404).json({
                      status: "failed",
                      message: "Product not found!",
                  });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }

    static async delete(req, res) {
        try {
            const id = +req.params.id;
            const result = await product.destroy({ where: { id } });

            result === 1
                ? res.status(200).json({
                      status: "success",
                      message: `Item ${id} has been deleted.`,
                  })
                : res.status(404).json({
                      status: "failed",
                      message: `Id ${id} not found.`,
                  });
        } catch (err) {
            res.status(500).json({
                status: "failed",
                message: String(err),
            });
        }
    }
}

module.exports = ProductController;
