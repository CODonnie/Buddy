import { Router } from 'express';
import { askPrompt, getPromptHistory } from '../controllers/promptController';
import { protect } from '../middlewares/authMiddleware';

const promptRouter = Router();

promptRouter.post('/ask', protect, askPrompt);
promptRouter.get('/history', protect, getPromptHistory);

export default promptRouter;