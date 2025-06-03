import { lucia } from "~/server/utils/lucia";

export default defineEventHandler(async (event) => {
	const sessionId = getCookie(event, lucia.sessionCookieName);

	if (!sessionId) {
		throw createError({
			statusCode: 401,
			statusMessage: "No session found",
		});
	}

	await lucia.invalidateSession(sessionId);

	const sessionCookie = lucia.createBlankSessionCookie();
	setCookie(
		event,
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return { success: true };
});
