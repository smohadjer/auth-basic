// Basic Auth example via Vercel edge middleware and without using a framework

//import { next } from '@vercel/edge';

export const config = {
  // Only run the middleware on the home route
  matcher: '/admin.html',
};

export default function middleware(req) {
  const url = new URL(req.url);

  console.log('url:', url.pathname);
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === process.env.username && pwd === process.env.password) {
      //next();
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
