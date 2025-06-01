import { hash, verify } from '@node-rs/argon2'
import prisma from '~/server/utils/prisma'
import jwt from 'jsonwebtoken'
import {lucia} from '../../utils/lucia';

interface LoginRequest {
  identifier: string // username or email
  password: string
  rememberMe?: boolean
}

interface LoginResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
  }
  token?: string
  sessionId?: string
}

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  try {
    // Only allow POST requests
    assertMethod(event, 'POST')

    const body = await readBody<LoginRequest>(event)

    // Validate required fields
    if (!body.identifier || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username/email and password are required'
      })
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: body.identifier },
          { email: body.identifier }
        ]
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Account not found'
      })
    }

    // Verify password
    const isValidPassword = await verify(user.password_hash, body.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid password'
      })
    }

    // Generate session ID
    const sessionId = generateSessionId()

    // Set session expiration (30 days if remember me, otherwise 24 hours)
    const expiresAt = new Date()
    if (body.rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours
    }

    // Create session in database
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt: expiresAt
      }
    })

    // Generate JWT token (optional - you can use just sessions)
    const jwtSecret = useRuntimeConfig().jwtSecret || 'your-secret-key'
    const token = jwt.sign(
      { 
        userId: user.id, 
        sessionId: sessionId,
        username: user.username 
      },
      jwtSecret,
      { 
        expiresIn: body.rememberMe ? '30d' : '24h' 
      }
    )

    // Set HTTP-only cookie for session
    setCookie(event, 'session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // seconds
      path: '/'
    })

    // Optional: Set auth token cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: '/'
    })

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: token,
      sessionId: sessionId
    }

  } catch (error) {
    console.error('Login error:', error)

    // Handle known errors
    if (error as any) {
      throw error
    }

    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during login'
    })
  } finally {
    await prisma.$disconnect()
  }
})

// Helper function to generate secure session ID
function generateSessionId(): string {
  return crypto.randomUUID();
}
