import { lucia } from '../../utils/lucia'
import { eq, or } from 'drizzle-orm'
import {db} from '~/server/utils/drizzle'
import { users } from '~/server/schema'
import { hash } from '@node-rs/argon2'
import type { InferSelectModel } from 'drizzle-orm'

type User = InferSelectModel<typeof users>

interface RegisterRequest {
  username: string
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
    avatar?: string | null
    role: string
  }
}

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  try {
    assertMethod(event, 'POST')
    const body = await readBody<RegisterRequest>(event)

    // Validation
    if (!body.username || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate username format (letters, numbers, underscores, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(body.username)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
      })
    }

    // Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(body.password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
      })
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(
      or(
        eq(users.username, body.username),
        eq(users.email, body.email)
      )
    ).then(rows => rows[0])

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username or email already exists'
      })
    }

    // Hash password
    const passwordHash = await hash(body.password)

    // Create user
    const userId = crypto.randomUUID()
    const newUser = await db.insert(users)
      .values({
        id: userId,
        username: body.username,
        email: body.email,
        password_hash: passwordHash,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning()
      .then(rows => rows[0])

    // Create session with Lucia
    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    
    // Set session cookie with optional remember me
    setCookie(event, sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      maxAge: body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours
    })

    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar || '/default-avatar.png',
        role: newUser.role
      }
    }

  } catch (error) {
    console.error('Registration error:', error)

    if ((error as any).statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
