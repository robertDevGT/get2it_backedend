import type { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import User from "../models/User.model";
import Token from "../models/Token.model";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const userExists = await User.findOne({ where: { email: email } });

            if (userExists) {
                const error = new Error('El usuario ya esta registrado');
                res.status(409).send({ error: error.message });
                return;
            }

            const password = await hashPassword(req.body.password);
            const user = await User.create({ name: req.body.name, email: req.body.email, password: password });

            const token = await Token.create({ token: generateToken(), userId: user.id });

            const now = new Date();
            now.setMinutes(now.getMinutes() + 10);
            token.expiresAt = now;

            await token.save();

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            res.send('Cuenta Creada Correctamente, revisa tu Email para confirmarla');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async confirmAccount(req: Request, res: Response) {
        try {
            const token = await Token.findOne({ where: { token: req.body.token } });

            if (!token) {
                res.status(401).send('Token no válido');
                return;
            }

            const expiresAt = token.expiresAt;
            const now = new Date();
            const difMs = now.getTime() - expiresAt.getTime();
            const difMins = Math.floor(difMs / 1000 / 60);

            if (difMins > 10) {
                await token.destroy();
                res.status(401).send('Token no válido');
                return;
            }

            const user = await User.findByPk(token.userId);
            user.confirmed = true;
            
            await Promise.allSettled([user.save(),token.destroy()]);
            res.send('Cuenta confirmada correctamente');
        } catch (error) {
            res.status(500).send({ error: 'Hubo un error' });
        }
    }
}