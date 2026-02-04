import express from "express";
import { register, login, getMe, getAllStudents, getChildren, protect } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/students', protect, getAllStudents);
router.get('/children', protect, getChildren);

export default router;
