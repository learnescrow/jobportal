import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/employer(.*)",
  "/candidate(.*)",
]);

// Public auth route
const isAuthRoute = createRouteMatcher([
  "/auth(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // 🚨 NEVER protect /auth
  if (isAuthRoute(req)) {
    return;
  }

  // 🔐 Protect dashboard, pricing, etc.
  if (isProtectedRoute(req) && !session.userId) {
    return session.redirectToSignIn({
      returnBackUrl: req.url,
    });
  }
});
export const config = {
  matcher: [
    // run Middleware for all routes except static files and Next internals
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};