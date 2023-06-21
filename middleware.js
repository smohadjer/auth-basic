// Basic Auth example via Vercel edge middleware and without using a framework

import { next } from '@vercel/edge';

export default function middleware(req) {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === 'admin' && pwd === 'admin') {
        next();
      } else {
        return new Response('credentials wrong', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic' },
        });
      }
    } else {
      return new Response('credentials missing', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      });
    }
  }
}
