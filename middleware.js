import { rewrite, next } from '@vercel/edge';

export default function middleware(req) {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/admin')) {
    //const requestHeaders = new Headers(request.headers);
    //const auth = requestHeaders.get('Authorization');
    const basicAuth = req.headers.get('authorization');

    if (!basicAuth) {
      return new Response('credentials missing', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      });
    } else {
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
    }
  }
}
