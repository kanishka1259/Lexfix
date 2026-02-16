import express from "express";
import { protect } from "../../routes_learning/authMiddleware.js";
import performanceRoutes from "./performanceRoutes.js";
import recommendationRoutes from "./recommendationRoutes.js";
import learningPathRoutes from "./learningPathRoutes.js";
import interactionRoutes from "./interactionRoutes.js";



const router = express.Router();

// Apply auth middleware to all module4 routes
router.use(protect);

router.use("/performance", performanceRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/learning-path", learningPathRoutes);
router.use("/interactions", interactionRoutes);




export default router;
