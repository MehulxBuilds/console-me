import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { protect } from "../middleware/user-middleware";
import { createProfile, updateProfile, fetchProfile, fetchAllProfile, switchProfile, fetchProfileByUsername } from "../controller/creator-controller";
import { protectCreator } from "../middleware/creator-middleware";

const creatorRoutes: ExpressRouter = Router();

// Public route for fetching creator by username
creatorRoutes.get('/u/:username', fetchProfileByUsername);

creatorRoutes.use(protect);

creatorRoutes.post('/create-profile', createProfile);
creatorRoutes.put('/update-profile', protectCreator, updateProfile);
creatorRoutes.put('/switch-profile', protectCreator, switchProfile);
creatorRoutes.get('/fetch-profile', fetchProfile);
creatorRoutes.get('/fetch-all-profile', fetchAllProfile);

export default creatorRoutes;