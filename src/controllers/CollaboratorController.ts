import { Request, Response } from "express";
import User from "../models/User.model";
import ProjectUser from "../models/ProjectUser.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";

export class CollaboratorController {
    static async findCollaboratorByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const { projectId } = req.params;

            const user = await User.findOne({ where: { 'email': email }, attributes: ['id', 'name', 'email', 'profileImg'] });

            if (!user) {
                res.status(404).send({ error: 'Usuario no Encontrado' });
                return;
            }

            const assignee = await ProjectUser.findOne({ where: { projectId: projectId, userId: user.id } });

            let data = {};

            if (assignee) {
                data = {
                    ...user.get(),
                    flag: true
                }

            } else {
                data = {
                    ...user.get(),
                    flag: false
                }
            }

            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async addCollaboratorToProject(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const { userId } = req.body;

            const user = await User.findByPk(userId);

            if (!user) {
                res.status(404).send({ error: 'Usuario no Encontrado' });
                return;
            }

            const project = await Project.findByPk(projectId);

            if (!project) {
                res.status(404).send({ error: 'Proyecto no Encontrado' });
                return;
            }

            await ProjectUser.create({
                userId: user.id,
                projectId: project.id,
                role: 2
            });

            res.send('Colaborador Agregado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async deleteCollaboratorFromProject(req: Request, res: Response) {
        try {
            const { projectId, userId } = req.params;

            const projectUser = await ProjectUser.findOne({ where: { userId: userId, projectId: projectId } });

            if (!projectUser) {
                res.send(404).send('Usuario no asignado');
                return;
            }

            const tasks = await Task.findAll({ where: { assigneeId: userId } });

            tasks.map(async (task) => {
                task.assigneeId = null;
                await task.save();
            });

            await projectUser.destroy();

            res.send('Usuario Removido Correctamente');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}