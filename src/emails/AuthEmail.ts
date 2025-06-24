import { transporter } from "../config/nodemailer";
import dontenv from "dotenv";

dontenv.config();

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: "Get2It <admin@get2it.com>",
            to: user.email,
            subject: 'Get2It - Confirma tu Cuenta',
            text: 'Get2It - Confirma tu Cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en Get2It, ya casi esta todo listo solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/confirm-account">Confirma tu cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    }
}