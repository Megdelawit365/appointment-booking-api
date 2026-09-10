import { OAuth2Client } from "google-auth-library"
import { env } from "../config/env.js"

const googleClient = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URL
)

export function getGoogleAuthUrl(): string {
    return googleClient.generateAuthUrl({
        access_type: "offline",
        prompt: 'consent',
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    })
}

export async function getGoogleUserFromCode(code: string) {
    const { tokens } = await googleClient.getToken(code)
    googleClient.setCredentials(tokens)

    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
        throw new Error("Invalid Google Account details")
    }

    return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || "Patient",
    }
}