import { Router } from 'express';
import { body } from "express-validator";
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { imageExists } from '../middlewares/img';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token es requerido'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login
)

router.get('/user',
    authenticate,
    AuthController.user
)

router.patch('/user',
    authenticate,
    upload.single('img'),
    imageExists,
    handleInputErrors,
    AuthController.updateProfileImg
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('El token es requerido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas deben de coincidir");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)



export default router;