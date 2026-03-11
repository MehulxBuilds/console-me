import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { joinOmegle, pollMatch, getToken, skipMatch, leaveOmegle } from "../controller/omegle-controller";

const omegleRoutes: ExpressRouter = Router();

omegleRoutes.use(protect);

omegleRoutes.post('/join', joinOmegle);
omegleRoutes.post('/poll', pollMatch);
omegleRoutes.post('/token', getToken);
omegleRoutes.post('/skip', skipMatch);
omegleRoutes.post('/leave', leaveOmegle);

export default omegleRoutes;
