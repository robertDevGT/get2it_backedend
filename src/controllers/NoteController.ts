import { Request, Response } from "express";
import Note from "../models/Note.model";
import User from "../models/User.model";

export class NoteController {
    static async createNote(req: Request, res: Response) {
        try {
            const { description } = req.body;

            await Note.create({
                taskId: +req.task.id,
                userId: req.user.id,
                description: description,
            });

            res.send('Nota Creada Correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getNotesByTaskId(req: Request, res: Response) {
        try {
            const notes = await Note.findAll({ where: { taskId: req.task.id }, attributes: ['id', 'description', 'createdAt'], include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] } });

            res.json(notes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteNote(req: Request, res: Response) {
        try {
            const { noteId } = req.params;

            const note = await Note.findByPk(noteId);

            if (!note) {
                res.status(404).send('Nota no Encontrada');
                return;
            }

            if (note.userId !== req.user.id) {
                res.status(404).send('No autorizado');
                return;
            }

            await note.destroy();

            res.send('Nota Elimnada Correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}