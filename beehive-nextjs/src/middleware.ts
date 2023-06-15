export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/profile/:path*',
    '/my-jobs',
    '/notifications',
    '/my-posts/:path*',
    '/my-centre',
  ],
}
