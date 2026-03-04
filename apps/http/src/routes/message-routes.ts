import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { getConversations, getMessageHistory, sendMessage } from "../controller/message-controller";

const messageRoutes: ExpressRouter = Router();

messageRoutes.use(protect);

messageRoutes.get('/conversations', getConversations);
messageRoutes.get('/history/:userId', getMessageHistory);
messageRoutes.post('/send', sendMessage);

export default messageRoutes;
