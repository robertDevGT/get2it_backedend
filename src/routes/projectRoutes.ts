import { Router } from 'express';
import { body } from "express-validator";
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { ProjectController } from '../controllers/ProjectController';

const router = Router();

router.use(authenticate);

router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('description').notEmpty().withMessage('La descripción del proyecto es requerida'),
    handleInputErrors,
    ProjectController.crateProject
)

router.get('/',
    ProjectController.getAllProjects
)


export default router