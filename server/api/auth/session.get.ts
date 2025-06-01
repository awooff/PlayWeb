import { lucia } from '~/server/utils/lucia'
import { users } from '~/server/schema'
import type { InferSelectModel } from 'drizzle-orm'

type DbUser = InferSelectModel<typeof users>

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName)
  
  if (!sessionId) {
    return { user: null, session: null }
  }

  const { session, user } = await lucia.validateSession(sessionId)
  
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
  
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()
    setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    return { user: null, session: null }
  }

  return {
    user: user ? {
      id: user.id,
      username: (user as DbUser).username,
      email: (user as DbUser).email,
      avatar: (user as DbUser).avatar,
      role: (user as DbUser).role,
    } : null,
    session: {
      id: session.id,
      expiresAt: session.expiresAt
    }
  }
})
