import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { checkAvailaible, claimUsername, deleteUserProfile, updateUserProfile, searchUsers, fetchUserById } from "../controller/user-controller";

const userRoutes: ExpressRouter = Router();

userRoutes.use(protect);

userRoutes.delete('/delete-profile', deleteUserProfile);
userRoutes.put('/update-profile', updateUserProfile);
userRoutes.post('/claim-username', claimUsername);
userRoutes.post('/check-username-availaible', checkAvailaible);
userRoutes.get('/search', searchUsers);
userRoutes.get('/:id', fetchUserById);

export default userRoutes;