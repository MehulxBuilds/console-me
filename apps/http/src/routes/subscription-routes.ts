import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { toggleSubscription, checkSubscriptionStatus } from "../controller/subscription-controller";

const subscriptionRoutes: ExpressRouter = Router();

subscriptionRoutes.use(protect);

subscriptionRoutes.post('/:creatorId', toggleSubscription);
subscriptionRoutes.get('/check/:creatorId', checkSubscriptionStatus);

export default subscriptionRoutes;
