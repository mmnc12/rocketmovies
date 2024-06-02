const { Router } = require("express");

const SessionsControllers = require("../controller/SessionsControllers");
const sessionsControllers = new SessionsControllers();

const sessionsRoutes = Router();
sessionsRoutes.post("/", sessionsControllers.create);

module.exports = sessionsRoutes;