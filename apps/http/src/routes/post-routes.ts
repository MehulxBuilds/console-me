import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { createPost, deletePost, fetchAllPost, fetchPost, getFeedPost, updatePost } from "../controller/post-controller";
import { protectCreator } from "../middleware/creator-middleware";

const postRoutes: ExpressRouter = Router();

postRoutes.use(protect, protectCreator);

postRoutes.post('/create', createPost);
postRoutes.put('/update/:postId', updatePost);
postRoutes.delete('/delete/:postId', deletePost);
postRoutes.get('/:postId', fetchPost);
postRoutes.get('/fead/all', getFeedPost);
postRoutes.get('/:creatorId', fetchAllPost);

export default postRoutes;