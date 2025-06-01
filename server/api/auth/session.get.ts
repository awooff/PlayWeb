import { lucia } from '~/server/utils/lucia'

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
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role
    } : null,
    session: {
      id: session.id,
      expiresAt: session.expiresAt
    }
  }
})
