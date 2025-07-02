import { Sequelize } from "sequelize-typescript";
import { exit } from "node:process";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*']
});

async function connectDB() {
    try {
        await db.authenticate();
        await db.sync({ alter: true });
        console.log(colors.green.bold('Conexión exitosa a la base de datos'));
    } catch (error) {
        console.log(colors.red.bold(`Hubo un error al conectar a la base de datos ${error.message}`));
        exit(1);
    }
}

export default connectDB;