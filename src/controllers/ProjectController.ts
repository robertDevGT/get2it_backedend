import { Request, Response } from "express";
import Project from "../models/Project.model";

export class ProjectController {
    static async crateProject(req: Request, res: Response) {
        try {
            await Project.create({
                projectName: req.body.projectName,
                description: req.body.description,
                manager: req.user.id
            });
            res.send('Proyecto Creado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el proyecto' });
        }
    }

    static async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await Project.findAll({ where: { manager: req.user.id }, attributes: ['id', 'projectName', 'description'] });
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el proyecto' });
        }
    }
}