import { hash, verify } from "@node-rs/argon2";
import { db } from "~/server/utils/db";
import { lucia } from "../../utils/lucia";
import { eq, or } from "drizzle-orm";
import { users } from "~/server/schema";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

interface LoginRequest {
	identifier: string; // username or email
	password: string;
	rememberMe?: boolean;
}

interface LoginResponse {
	success: boolean;
	message: string;
	user?: {
		id: string;
		username: string;
		email: string;
		avatar?: string | null;
		role: string;
	};
}

export default defineEventHandler(async (event): Promise<LoginResponse> => {
	try {
		assertMethod(event, "POST");
		const body = await readBody<LoginRequest>(event);

		if (!body.identifier || !body.password) {
			throw createError({
				statusCode: 400,
				statusMessage: "Username/email and password are required",
			});
		}

		// Find user by username or email
		const user = await db
			.select()
			.from(users)
			.where(
				or(
					eq(users.username, body.identifier),
					eq(users.email, body.identifier),
				),
			)
			.then((rows) => rows[0]);

		if (!user) {
			throw createError({
				statusCode: 404,
				statusMessage: "Account not found",
			});
		}

		// Verify password
		const isValidPassword = await verify(user.password_hash, body.password);

		if (!isValidPassword) {
			throw createError({
				statusCode: 401,
				statusMessage: "Invalid password",
			});
		}

		// Create Lucia session
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		// Set the session cookie
		setCookie(event, sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			maxAge: body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 24 hours
		});

		return {
			success: true,
			message: "Login successful",
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				avatar: user.avatar || "/default-avatar.png",
				role: user.role,
			},
		};
	} catch (error) {
		console.error("Login error:", error);

		if ((error as any).statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			statusMessage: "Internal server error during login",
		});
	}
});
