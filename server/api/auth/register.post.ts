import { lucia } from '../../utils/lucia'
import prisma from '~/lib/prisma'
import { hash } from '@node-rs/argon2'

export default defineEventHandler(async (event) => {
  const { username, email, password } = await readBody(event)

  // Validation
  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username or email already exists'
      })
    }

    // Hash password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash
      }
    })

    // Create session
    const session = await lucia.createSession(user.id, {})
    
    // Set session cookie
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())

    return { success: true, userId: user.id }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
