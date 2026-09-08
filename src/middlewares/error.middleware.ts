import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { Prisma } from "../generated/prisma/index.js"

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return res.status(409).json({
                    message: "Record already exists."
                })
            case "P2025":
                return res.status(404).json({
                    message: "Record not found."
                })
            case "P2003":
                return res.status(400).json({
                    message: "Referenced ID not found."
                })
        }
    }

    return res.status(500).json({
        message: "Internal server error."
    })
}