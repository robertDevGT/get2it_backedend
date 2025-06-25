import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { body } from 'express-validator';
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/:projectId',
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/task/:taskId',
    TaskController.getTaskById
)

router.put('/task/:taskId',
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    TaskController.updateTask
)

router.patch('/task/:taskId',
    body('status').notEmpty().withMessage('El estado es requerido'),
    handleInputErrors,
    TaskController.changeTaskStatus
)

router.delete('/task/:taskId/:projectId',
    handleInputErrors,
    TaskController.deleteTask
)



export default router;