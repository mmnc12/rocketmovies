const { Router } = require("express");
const NotesControllers = require("../controller/NotesControllers");
const ensureAuthenticated =  require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();
const notesControllers = new NotesControllers();

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notesControllers.index);
notesRoutes.post("/", notesControllers.create);
notesRoutes.get("/:id", notesControllers.show);
notesRoutes.delete("/:id", notesControllers.delete);

module.exports = notesRoutes;