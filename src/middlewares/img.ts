import type { Request, Response, NextFunction } from "express";

export const imageExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'La imagen es requerida' });
        }
    } catch (error) {
        res.status(500).send('Hubo un error');
    }

    next();
};