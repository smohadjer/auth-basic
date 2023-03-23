export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('Hello World')
  res.end()
}
