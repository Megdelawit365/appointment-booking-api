import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateRequest = (schema: ZodType): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Input validation failed',
                    errors: error.issues.map((err) => ({
                        field: err.path.join('.').replace(/^body\./, ''),
                        message: err.message,
                    })),
                });
            }
            return res.status(500).json({ message: 'Internal server validation error' });
        }
    };
};

