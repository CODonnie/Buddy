import { Router } from 'express';
import { askPrompt, getPromptHistory, refinePrompt, goPrompt } from '../controllers/promptController';
import { protect } from '../middlewares/authMiddleware';

const promptRouter = Router();

promptRouter.post('/ask', protect, askPrompt);
promptRouter.get('/history', protect, getPromptHistory);
promptRouter.post("/refine", protect, refinePrompt);
promptRouter.post("/:id/go", protect, goPrompt);

export default promptRouter;