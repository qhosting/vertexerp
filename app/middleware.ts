
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;
    
    const isAuthPage = path.startsWith('/auth') || 
                      path.startsWith('/api/auth') ||
                      path === '/login' ||
                      path === '/signup';
                      
    const isTestPage = path.startsWith('/test-');
    const isPublicPage = path === '/' || path === '/landing';
    
    // If authenticated and trying to access auth pages (except API routes), redirect to dashboard
    if (token && isAuthPage && !path.startsWith('/api/auth')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If not authenticated and trying to access protected route (but allow test and public pages)
    if (!token && !isAuthPage && !isTestPage && !isPublicPage) {
      return NextResponse.redirect(new URL('/login', req.url)); // Prefer branded login
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow public access to home (/), landing page (/landing), auth pages, and test pages
        if (
          path === '/' ||
          path === '/landing' ||
          path === '/login' ||
          path === '/signup' ||
          path.startsWith('/auth') || 
          path.startsWith('/api/auth') ||
          path.startsWith('/test-')
        ) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

