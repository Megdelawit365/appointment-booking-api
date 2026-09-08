import { Request, Response, NextFunction } from 'express';
export const notFound = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        message: "Path not found."
    })
}
