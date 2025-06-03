export default defineNuxtRouteMiddleware(async (to) => {
	// Only run on client side for route protection
	if (import.meta.server) return;

	// Get current auth state
	const { data: authData } = await $fetch("/api/auth/session");

	// Define protected routes
	const protectedRoutes = ["/dashboard", "/profile", "/admin"];
	const authRoutes = ["/login", "/register", "/forgot-password"];

	const isProtectedRoute = protectedRoutes.some((route) =>
		to.path.startsWith(route),
	);
	const isAuthRoute = authRoutes.some((route) => to.path.startsWith(route));

	// If user is authenticated and trying to access auth pages, redirect to dashboard
	if (authData?.user && isAuthRoute) {
		return navigateTo("/dashboard");
	}

	// If user is not authenticated and trying to access protected pages, redirect to login
	if (!authData?.user && isProtectedRoute) {
		return navigateTo("/login");
	}
});
