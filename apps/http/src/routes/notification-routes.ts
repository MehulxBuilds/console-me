import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import postRoutes from "./post-routes";
import { fetchAllNotification, markAsReadNotification } from "../controller/notification-controller";

const notificationRoutes: ExpressRouter = Router();

postRoutes.use(protect);

notificationRoutes.post('/mark-as-read', markAsReadNotification);
notificationRoutes.get('/fetch-all', fetchAllNotification);

export default notificationRoutes;