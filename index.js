import readAuth from 'basic-auth';
import safeCompare from 'safe-compare';
import serveStatic from 'serve-static';
import testApi from './api/test.js';

console.log('index.js is loaded.');

const auth = (req, res) => new Promise(resolve => {
  const credentials = readAuth(req);
  const authorized = credentials && safeCompare(credentials.name, 'admin') && safeCompare(credentials.pass, 'admin');
  resolve(authorized);
});

const serveHandler = serveStatic(__dirname + '/public');
const serve = (req, res, handle404) => new Promise(() => serveHandler(req, res, handle404));

export default async (req, res) => {
  console.log('async fn is invoked');

  // If requests admin area, auth user before serving files
  if (req.url.startsWith('/admin')) {
    const authorized = await auth(req, res);
    if (!authorized) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="vercel-basic-auth.node"' });
      return res.end('Restricted area, please login (admin:admin).');
    }
  }

  if (req.url.startsWith('/api')) {
    testApi(req, res);
  }

  // Serve files
  return serve(req, res, () => {
    res.statusCode = 404;
    res.end('404 Not Found');
  });
};
