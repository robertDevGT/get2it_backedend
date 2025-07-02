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
            from: "GetItDone <robert@robertsantizo.site>",
            to: user.email,
            subject: 'GetItDone - Confirma tu Cuenta',
            text: 'GetItDone - Confirma tu Cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0,0,0,0.05);">
                    <h2 style="color: #333333;">Hola, ${user.name}</h2>
                    <p style="font-size: 16px; color: #555555;">
                        Gracias por registrarte en <strong>GetItDone</strong>. Ya casi está todo listo. Solo debes confirmar tu cuenta.
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        Haz clic en el siguiente enlace para confirmar tu cuenta:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/confirm-account" 
                        style="display: inline-block; padding: 12px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Confirmar Cuenta
                        </a>
                    </div>

                    <p style="font-size: 16px; color: #555555;">
                        O puedes usar el siguiente código de verificación:
                    </p>

                    <p style="font-size: 24px; color: #111111; font-weight: bold; text-align: center; margin: 20px 0;">
                        ${user.token}
                    </p>

                    <p style="font-size: 14px; color: #999999; text-align: center;">
                        ⚠️ Este código expira en 10 minutos
                    </p>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dddddd;">

                    <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                        © ${new Date().getFullYear()} GetItDone. Todos los derechos reservados.
                    </p>
                    </div>
                </div>
                `
        });

        console.log('Mensaje enviado', info.messageId);
    }

    static sendForgotPasswordEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: "GetItDone <robert@robertsantizo.site>",
            to: user.email,
            subject: 'GetItDone - Restablecer tu Contraseña',
            text: 'Haz clic en el enlace para restablecer tu contraseña',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0,0,0,0.05);">
                    <h2 style="color: #333333;">Hola, ${user.name}</h2>
                    <p style="font-size: 16px; color: #555555;">
                        Hemos recibido una solicitud para restablecer tu contraseña.
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        Haz clic en el siguiente botón para crear una nueva contraseña:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/new-password" 
                        style="display: inline-block; padding: 12px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Restablecer Contraseña
                        </a>
                    </div>

                    <p style="font-size: 16px; color: #555555;">
                        E ingresa el código de seguridad:
                    </p>

                    <p style="font-size: 24px; color: #111111; font-weight: bold; text-align: center; margin: 20px 0;">
                        ${user.token}
                    </p>

                    <p style="font-size: 14px; color: #999999; text-align: center;">
                        ⚠️ Este código expira en 10 minutos.
                    </p>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dddddd;">

                    <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                        © ${new Date().getFullYear()} GetItDone. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
        });

        console.log('Mensaje enviado', info.messageId);
    }

}