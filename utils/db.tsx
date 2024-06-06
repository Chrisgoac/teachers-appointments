import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function addUser(email: string, password: string, name: string) {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name
      }
    })
    return user
}