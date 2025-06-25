import { Request, Response } from "express";
import Project from "../models/Project.model";
import User from "../models/User.model";
import { checkPassword } from "../utils/auth";

export class ProjectController {
    static async crateProject(req: Request, res: Response) {
        try {
            await Project.create({
                projectName: req.body.projectName,
                description: req.body.description,
                managerId: req.user.id
            });
            res.send('Proyecto Creado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el proyecto' });
        }
    }

    static async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await Project.findAll({ where: { managerId: req.user.id }, attributes: ['id', 'projectName', 'description'] });
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async getProjectById(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const project = await Project.findByPk(projectId, { attributes: ['id', 'projectName', 'description', 'managerId'], include: { model: User, as: 'manager', attributes: ['name', 'email'] } });

            if (!project) {
                res.status(404).json({ error: 'Proyecto no Encontrado' });
                return;
            }

            if (project.managerId !== req.user.id) {
                res.status(403).json({ error: 'No autorizado' });
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

            res.json('Proyecto eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}