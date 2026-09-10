import { prisma } from "../src/lib/prisma.js"

async function main() {
    await prisma.rolePermission.deleteMany({})
    await prisma.permission.deleteMany({})
    await prisma.role.deleteMany({})

    const permissions = [
        "appointments:create",
        "appointments:read:own",
        "appointments:read:all",
        "appointments:update:own",
        "appointments:delete:own",
    ]

    for (const action of permissions) {
        await prisma.permission.create({
            data: { action },
        })
    }

    const patientRole = await prisma.role.create({
        data: { name: "PATIENT" },
    })

    const doctorRole = await prisma.role.create({
        data: { name: "DOCTOR" },
    })

    const adminRole = await prisma.role.create({
        data: { name: "ADMIN" },
    })

    const patientPerms = ["appointments:create", "appointments:read:own", "appointments:update:own", "appointments:delete:own"]
    const doctorPerms = ["appointments:read:all"]
    const adminPerms = [...permissions]

    for (const action of patientPerms) {
        const perm = await prisma.permission.findUnique({ where: { action: action } })
        if (perm) {
            await prisma.rolePermission.create({
                data: { roleId: patientRole.id, permissionId: perm.id },
            })
        }
    }

    for (const action of doctorPerms) {
        const perm = await prisma.permission.findUnique({ where: { action: action } })
        if (perm) {
            await prisma.rolePermission.create({
                data: { roleId: doctorRole.id, permissionId: perm.id },
            })
        }
    }

    for (const action of adminPerms) {
        const perm = await prisma.permission.findUnique({ where: { action: action } })
        if (perm) {
            await prisma.rolePermission.create({
                data: { roleId: adminRole.id, permissionId: perm.id },
            })
        }
    }

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 