import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { CollaboratorController } from "../controllers/CollaboratorController";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.use(authenticate);

router.post('/:projectId',
    body('email').notEmpty().withMessage('El email es requerido'),
    body('email').isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    CollaboratorController.findCollaboratorByEmail
);

router.post('/:projectId/add',
    body('userId').notEmpty().withMessage('El usuario es requerido'),
    handleInputErrors,
    CollaboratorController.addCollaboratorToProject
);



export default router;