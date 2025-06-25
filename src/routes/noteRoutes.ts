import { Router } from 'express';
import { body } from "express-validator";
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { NoteController } from '../controllers/NoteController';
import { taskExists } from '../middlewares/notes';

const router = Router();
router.use(authenticate);
router.param('taskId', taskExists);

router.post('/:taskId',
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:taskId',
    handleInputErrors,
    NoteController.getNotesByTaskId
)

router.delete('/:noteId',
    handleInputErrors,
    NoteController.deleteNote
)

export default router;
