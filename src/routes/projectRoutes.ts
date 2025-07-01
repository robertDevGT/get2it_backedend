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

router.get('/:projectId',
    ProjectController.getProjectById
)

router.get('/:projectId/team',
    ProjectController.getProjectTeam
)

router.get('/:projectId/tasks',
    ProjectController.getProjectTasks
)

router.patch('/:projectId',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('description').notEmpty().withMessage('La descripción del proyecto es requerida'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:projectId',
    handleInputErrors,
    ProjectController.deleteProject
)

router.get('/:projectId/check/:userId',
    ProjectController.checkManagerRole
)

router.get('/:projectId/stadistics',
    ProjectController.projectTeamStadistics
)


export default router