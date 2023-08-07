const allowedCors = [
  'https://api.alex-gorasenko.mesto.nomoredomains.xyz',
  'https://alex-gorasenko.mesto.nomoredomains.xyz',
  'https://localhost:3000',
  'http://api.alex-gorasenko.mesto.nomoredomains.xyz',
  'http://alex-gorasenko.mesto.nomoredomains.xyz',
  'http://localhost:3000',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};

module.exports = cors;
