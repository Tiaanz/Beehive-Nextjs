// export { default } from 'next-auth/middleware'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    if (
      (req.nextUrl.pathname.startsWith('/my-posts') ||
        req.nextUrl.pathname.startsWith('/profile/reliever-profile') ||
        req.nextUrl.pathname.startsWith('/my-centre')) &&
      req.nextauth.token?.role !== 'MANAGER'
    ) {
      return NextResponse.rewrite(
        new URL('/login?message=You are not authorised.', req.url)
      )
    }
    if (
      (req.nextUrl.pathname.startsWith('/my-jobs') ||
        req.nextUrl.pathname.startsWith('/profile/centre-profile') ||
        req.nextUrl.pathname.startsWith('/job-info')) &&
      req.nextauth.token?.role !== 'RELIEVER'
    ) {
      return NextResponse.rewrite(
        new URL('/login?message=You are not authorised.', req.url)
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/my-jobs',
    '/notifications',
    '/my-posts/:path*',
    '/my-centre',
    '/job-info/:path*',
  ],
}
