const express = require('express');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
let auth = null;

app.use(cors());

app.use('/api', proxy({
  target: process.env.ADDRESS_HOST,
  changeOrigin: true,
  secure: false,
  onProxyRes: (res) => {
    delete res.headers['set-cookie'];
  },
  onProxyReq: (req) => {
    req.setHeader('authorization', auth);
  },
  headers: {
    'accept': 'application/json',
    'origapp': 'X',
    'x-application-context': 'X/1.0',
    'x-b3-traceid': '00000000-0000-0000-0000-000000000000',
  },
}));

const getAuthentication = async () => {
  const url = process.env.AUTH_HOST + 'zeroauthntokenissuer/tokens/v1';
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    referrerPolicy: 'no-referrer-when-downgrade',
    body: JSON.stringify({
      audience: 'X',
      scopes: ['AU.UNAUTHENTICATED'],
    }),
    method: 'POST',
    mode: 'cors',
  });
  const json = await res.json();
  const auth = json['Jwt-Token'];
  return auth;
};

const updateAuthentication = async () => {
  try {
    console.info('Fetch JWT');
    auth = await getAuthentication();
    console.log(auth);
  } catch (err) {
    console.error('Error fetching JWT');
    console.error(err.message);
  }
};

updateAuthentication(); // Fetch token immediately
setInterval(updateAuthentication, 1000 * 60 * 5); // Update every 5 minutes

app.listen(8080);
