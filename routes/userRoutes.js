const userRoute = require("express").Router();
const { UserController } = require("../controllers");
const { storage, multer } = require("../middlewares/multer");
const { auth } = require("../middlewares/auth");
const upload = multer({ storage: storage });

userRoute.post("/login", UserController.login);
userRoute.post("/register", UserController.register);
userRoute.get("/detail", auth, UserController.getUserDetail);
userRoute.put(
    "/update",
    auth,
    upload.single("profile_picture"),
    UserController.update
);
userRoute.put("/password", auth, UserController.updatePassword);

module.exports = userRoute;
