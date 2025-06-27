import { Request, Response } from "express";
import { Model, Op, Sequelize } from "sequelize";
import Project from "../models/Project.model";
import User from "../models/User.model";
import Task from "../models/Task.model";
import ProjectUser from "../models/ProjectUser.model";

export class ProjectController {
    static async crateProject(req: Request, res: Response) {
        try {
            const project = await Project.create({
                projectName: req.body.projectName,
                description: req.body.description,
                managerId: req.user.id
            });

            await ProjectUser.create({
                projectId: project.id,
                userId: req.user.id,
                role: 1
            });
            res.send('Proyecto Creado Correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await Project.findAll({
                where: {
                    [Op.or]: [
                        { managerId: req.user.id },
                        Sequelize.literal(`EXISTS (
                        SELECT 1 FROM "projectUsers"
                        WHERE "projectUsers"."projectId" = "Project"."id"
                        AND "projectUsers"."userId" = ${req.user.id}
                    )`)
                    ]
                },
                attributes: ['id', 'projectName', 'description', 'createdAt', 'managerId'],
            });
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async getProjectById(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const project = await Project.findByPk(projectId, {
                attributes: ['id', 'projectName', 'description', 'managerId'],
                include: [
                    { model: User, as: 'manager', attributes: ['name', 'email'] },
                ]
            });

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            res.status(200).json(project);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProject(req: Request, res: Response) {
        try {
            const { projectName, description } = req.body;
            const { projectId } = req.params;
            const project = await Project.findByPk(projectId);

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            if (project.managerId != req.user.id) {
                res.status(403).json({ error: "No autorizado" });
                return;
            }

            project.projectName = projectName;
            project.description = description

            project.save()

            res.send('Proyecto Actualizado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el proyecto' });
        }
    }

    static async deleteProject(req: Request, res: Response) {
        try {
            const { projectId } = req.params;

            const project = await Project.findByPk(projectId);

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            if (project.managerId != req.user.id) {
                res.status(403).json({ error: "No autorizado" });
                return;
            }

            project.destroy();

            res.send('Proyecto eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async getProjectTeam(req: Request, res: Response) {
        try {
            const { projectId } = req.params;

            const project = await Project.findByPk(projectId);

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            const members = await ProjectUser.findAll({ where: { projectId: project.id }, attributes: ['id', 'role', 'createdAt'], include: { model: User, as: 'member', attributes: ['id', 'name', 'email', 'profileImg'] } });

            res.send(members)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }

    }

    static async getProjectTasks(req: Request, res: Response) {
        try {
            const { projectId } = req.params;

            const project = await Project.findByPk(projectId);

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            const tasks = await Task.findAll({ where: { projectId: project.id }, include: { model: User, as: 'assignee', attributes: ['id', 'name', 'profileImg'] } });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}