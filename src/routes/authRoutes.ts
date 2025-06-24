import { Router } from 'express';
import { body } from "express-validator";
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas deben de coincidir");
        }
        return true;
    }),
    body('email').isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount
);



export default router;