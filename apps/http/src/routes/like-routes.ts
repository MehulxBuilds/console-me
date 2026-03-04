import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { likePost } from "../controller/like-controller";

const likeRoutes: ExpressRouter = Router();

likeRoutes.use(protect);

likeRoutes.post('/post/:postId', likePost);

export default likeRoutes;