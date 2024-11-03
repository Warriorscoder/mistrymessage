import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;  // Extract token from cookies (or use headers if preferred)
  console.log("middleware token-> ",token)
  const url = request.nextUrl;
  const secret = process.env.JWT_SECRET;  // Your JWT secret
  
  // Define token verification function
  const verifyToken = (token: string) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  };
  
  const user = token ? verifyToken(token) : null; // Decode and verify token
  console.log("middleware user-> ",user)

  // Redirect authenticated users away from login pages to dashboard
  if (
    user &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!user && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next(); // Allow request if no redirects are triggered
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/', '/dashboard', '/verify/:path*'],
};
