const productRoute = require("express").Router();
const { ProductController } = require("../controllers");
const { storage, multer } = require("../middlewares/multer");
const { auth } = require("../middlewares/auth");
const upload = multer({ storage: storage });

productRoute.get("/", auth, ProductController.getProducts);
productRoute.get("/:id", auth, ProductController.getProductById);
productRoute.post(
    "/create",
    auth,
    upload.single("image"),
    ProductController.add
);
productRoute.put(
    "/update/:id",
    auth,
    upload.single("image"),
    ProductController.update
);
productRoute.delete("/delete/:id", auth, ProductController.delete);

module.exports = productRoute;
