import express from 'express';
import {register, login, getUserByEmail} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/by-email', getUserByEmail);


export default router;
