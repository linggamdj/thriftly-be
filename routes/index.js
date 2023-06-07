const route = require("express").Router();
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");

route.get("/api", (req, res) => {
    res.status(200).json({
        message: "Welcome to Thriftly API",
    });
});

route.use("/api/users", userRoutes);
route.use("/api/products", productRoutes);

module.exports = route;
