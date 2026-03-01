import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { createPost, deletePost, fetchAllPost, fetchPost, getFeedPost, updatePost } from "../controller/post-controller";
import { protectCreator } from "../middleware/creator-middleware";

const postRoutes: ExpressRouter = Router();

postRoutes.use(protect);

postRoutes.post('/create', protectCreator, createPost);
postRoutes.put('/update/:postId', protectCreator, updatePost);
postRoutes.delete('/delete/:postId', protectCreator, deletePost);

postRoutes.get('/fead/all', getFeedPost);
postRoutes.get('/creator/:creatorId', fetchAllPost);
postRoutes.get('/:postId', fetchPost);

export default postRoutes;