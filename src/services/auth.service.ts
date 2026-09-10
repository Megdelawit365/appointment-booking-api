import { prisma } from "../lib/prisma.js"
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, } from "../utils/auth.util.js"
import { AuthUser } from "../types/express.d.js"

async function getUserPermissions(roleId: string): Promise<string[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId },
        include: { permission: true },
    })
    return rolePermissions.map((rp) => rp.permission.action)
}

export async function registerPatient(data:
    {
        email: string;
        password: string;
        name: string;
        phone?: string
    }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) throw { status: 409, message: "Email already exists" }

    const patientRole = await prisma.role.findUnique({ where: { name: "PATIENT" } })
    if (!patientRole)
        throw { status: 500, message: "Role not found" }

    const passwordHash = await hashPassword(data.password)

    return prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name,
            phone: data.phone,
            roleId: patientRole.id,
        },
        select: { id: true, email: true, name: true, createdAt: true },
    })
}

export async function loginUser(email: string, pass: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
    })

    if (!user || !user.passwordHash) {
        throw { status: 401, message: "Invalid email or password" }
    }

    const isValid = await comparePassword(pass, user.passwordHash)
    if (!isValid) throw { status: 401, message: "Invalid email or password" }

    const permissions = await getUserPermissions(user.roleId)

    const authUser: AuthUser = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        permissions,
        tokenVersion: user.tokenVersion,
    }

    const accessToken = generateAccessToken(authUser)
    const refreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion })

    const hashedRefreshToken = await hashPassword(refreshToken)
    await prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken },
    })

    return { accessToken, refreshToken, user: authUser }
}

export async function refreshSession(token: string) {
    const decoded = verifyRefreshToken(token)
    if (!decoded) {
        throw { status: 401, message: "Invalid or expired refresh token" };
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true },
    })

    if (!user || !user.hashedRefreshToken || user.tokenVersion !== decoded.tokenVersion) {
        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    tokenVersion: { increment: 1 }
                    , hashedRefreshToken: null
                },
            })
        }
        throw { status: 403, message: "Invalid refresh token" }
    }

    const isMatching = await comparePassword(token, user.hashedRefreshToken)
    if (!isMatching) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenVersion: { increment: 1 },
                hashedRefreshToken: null
            },
        })
        throw { status: 403, message: "Invalid refresh token" }
    }

    const permissions = await getUserPermissions(user.roleId)
    const authUser: AuthUser = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        permissions,
        tokenVersion: user.tokenVersion,
    }

    const newAccessToken = generateAccessToken(authUser)
    const newRefreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion })

    const hashedRefreshToken = await hashPassword(newRefreshToken)
    await prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken },
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export async function handleGoogleOAuthUser(
    googleUser:
        {
            googleId: string;
            email: string;
            name: string
        }) {
    let user = await prisma.user.findUnique({
        where: { email: googleUser.email },
        include: { role: true },
    })

    const patientRole = await prisma.role.findUnique({ where: { name: "PATIENT" } })

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: googleUser.email,
                name: googleUser.name,
                roleId: patientRole!.id,
                accounts: {
                    create:
                    {
                        provider: "GOOGLE",
                        providerAccountId: googleUser.googleId
                    },
                },
            },
            include: { role: true },
        })
    } else {
        const existingAccount = await prisma.account.findFirst({
            where: {
                provider: "GOOGLE",
                providerAccountId: googleUser.googleId,
            },
        });


    }

    const permissions = await getUserPermissions(user.roleId)
    const authUser: AuthUser = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        permissions,
        tokenVersion: user.tokenVersion,
    }

    const accessToken = generateAccessToken(authUser)
    const refreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion })

    const hashedRefreshToken = await hashPassword(refreshToken)
    await prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken },
    })

    return { accessToken, refreshToken, user: authUser }
}