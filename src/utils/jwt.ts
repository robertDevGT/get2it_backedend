import jwt from "jsonwebtoken";
import User from "../models/User.model";
import dontenv from "dotenv";
dontenv.config();

export const generateJWT = (user: User) => {
    const data = {
        id: user.id,
        name: user.name,
        email: user.email
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '180d'
    });
    return token;
}
