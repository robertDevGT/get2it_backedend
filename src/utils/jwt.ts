import jwt from "jsonwebtoken";
import User from "../models/User.model";
import dontenv from "dotenv";
dontenv.config();

export const generateJWT = (user: User) => {
    const data = {
        name: user.name,
        email: user.email
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '6m'
    });
    return token;
}
