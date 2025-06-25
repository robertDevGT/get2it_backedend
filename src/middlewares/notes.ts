import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task.model";

declare global {
    namespace Express {
        interface Request {
            task?: ITask
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
        res.status(404).send('Tarea no Encontrada');
        return;
    }

    req.task = task;
    next();
};