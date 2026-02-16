import express from "express";
import performanceRoutes from "./performanceRoutes.js";
import recommendationRoutes from "./recommendationRoutes.js";
import learningPathRoutes from "./learningPathRoutes.js";
import interactionRoutes from "./interactionRoutes.js";



const router = express.Router();

router.use("/performance", performanceRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/learning-path", learningPathRoutes);
router.use("/interactions", interactionRoutes);




export default router;
