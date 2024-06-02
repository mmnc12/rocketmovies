const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersControllers = require("../controller/UsersControllers");
const UserAvatarControllers = require("../controller/UserAvatarControllers");
const ensureAuthenticated =  require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersControllers = new UsersControllers();
const userAvatarControllers = new UserAvatarControllers();

usersRoutes.post("/", usersControllers.create);
usersRoutes.put("/", ensureAuthenticated, usersControllers.update);
usersRoutes.delete("/:id", ensureAuthenticated,  usersControllers.delete);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarControllers.update);

module.exports = usersRoutes;