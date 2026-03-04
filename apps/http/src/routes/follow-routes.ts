import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { followCreator } from "../controller/follow-controller";


const followRoutes: ExpressRouter = Router();

followRoutes.use(protect);

followRoutes.post('/creator', followCreator);

export default followRoutes;