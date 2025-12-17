import express from 'express';
import { signup, login, me } from '../controllers/authController.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/me', me);
export default router;
