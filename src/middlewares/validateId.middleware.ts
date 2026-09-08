import { NextFunction, Request, Response } from "express";

export const validateId = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)

    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid ID." })
    }

    next()
}