import { Request, Response, NextFunction } from "express"

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" })
        }

        if (!req.user.permissions.includes(permission)) {
            return res.status(403).json({ message: "Forbidden" })
        }

        next()
    }
} 