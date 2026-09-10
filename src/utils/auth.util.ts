import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { AuthUser } from "../types/express.js"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateAccessToken(payload: AuthUser): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
}

export function generateRefreshToken(
  payload: {
    userId: string;
    tokenVersion: number
  }
): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser
}

export function verifyRefreshToken(token: string): {
  userId: string;
  tokenVersion: number
} | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; tokenVersion: number }
  } catch {
    return null
  }
}