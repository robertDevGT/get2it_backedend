import type { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import fs from "fs";
import path from "path";
import sharp from 'sharp';
import User from "../models/User.model";
import Token from "../models/Token.model";

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
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            const expiresAt = token.expiresAt;
            const now = new Date();
            const difMs = now.getTime() - expiresAt.getTime();
            const difMins = Math.floor(difMs / 1000 / 60);

            if (difMins > 10) {
                await token.destroy();
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            const user = await User.findByPk(token.userId);
            user.confirmed = true;

            await Promise.allSettled([user.save(), token.destroy()]);
            res.send('Cuenta confirmada correctamente');
        } catch (error) {
            res.status(500).send({ error: 'Hubo un error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { password, email } = req.body;

            const user = await User.findOne({ where: { email: email } });

            if (!user) {
                res.status(404).send({ error: 'Usuario no encontrado' });
                return;
            }

            if (!user.confirmed) {
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

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un email de confirmación');
                res.status(401).json({ error: error.message });
                return;
            }

            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                const error = new Error('Credenciales Incorrectas');
                res.status(401).json({ error: error.message });
                return;
            }

            const token = generateJWT(user);
            res.send(token);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async user(req: Request, res: Response) {
        res.send(req.user);
    }

    static async updateProfileImg(req: Request, res: Response) {
        try {
            const user = await User.findByPk(req.user.id);
            const filename = `user-${req.user.id}.png`;
            const outputPath = path.join(__dirname, '..', 'uploads', filename);
            await sharp(req.file.buffer)
                .resize(300, 300, {
                    fit: 'cover',
                    position: 'center'
                }).png().toFile(outputPath);

            user.profileImg = filename;
            await user.save();

            res.send('Imagen Actualizada Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}