import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { getGoogleAuthUrl, getGoogleUserFromCode } from "../services/oauth.service.js";
import { prisma } from "../lib/prisma.js";


export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await authService.registerPatient(req.body);
        return res.status(201).json({ message: "Registration successful", user });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken, user });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

        const tokens = await authService.refreshSession(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user) {
            await prisma.user.update({
                where: { id: req.user.userId },
                data: { hashedRefreshToken: null },
            });
        }
        res.clearCookie("refreshToken");
        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

export async function googleRedirect(req: Request, res: Response) {
    const url = getGoogleAuthUrl();
    return res.redirect(url);
}

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { code } = req.query;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ message: "Missing authorization code" });
        }

        const googleUser = await getGoogleUserFromCode(code);
        const { accessToken, refreshToken } = await authService.handleGoogleOAuthUser(googleUser);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ message: "Google authentication successful", accessToken });
    } catch (error) {
        next(error);
    }
}