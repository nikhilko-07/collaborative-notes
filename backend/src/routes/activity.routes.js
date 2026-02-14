import express from 'express';
import { getUserActivityFeed } from '../controllers/activity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getUserActivityFeed);

export default router;
