const express = require('express');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const fetch = require('node-fetch');

const getAuthentication = async () => {
  const res = await fetch('https://creditcardapp.anz.com/zeroauthntokenissuer/tokens/v1', {
    "credentials": "include",
    "headers": {
      "accept": "application/vnd.csp-anz.com+json;version=1.0",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "anz-application-id": "ANZ-AU-COLA",
      "anz-application-version": "1.0",
      "anz-request-id": "93acd8f6-9d28-4cab-9634-059fa15316fa",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "origapp": "COLA",
      "pragma": "no-cache",
      "requestid": "93acd8f6-9d28-4cab-9634-059fa15316fa",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-application-context": "ANZ-AU-COLA/1.0",
      "x-b3-traceid": "93acd8f6-9d28-4cab-9634-059fa15316fa"
    },
    "referrer": "https://creditcardapp.anz.com/",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "{\"audience\":\"cola\",\"scopes\":[\"AU.UNAUTHENTICATED\"]}",
    "method": "POST",
    "mode": "cors"
  });
  const json = await res.json();
  const auth = json['Jwt-Token'];
  return auth;
};

const app = express();

app.get('/', (_req, res) => {
  res.redirect('/api/electronicverification/verifications/addresses?limit=15&queryString=p07k%20211%20powlett');
});

app.use(cors());

(async () => {
  const auth = await getAuthentication();
  console.log(auth);
  app.use('/api', proxy({
    target: 'https://creditcardapp.anz.com/',
    changeOrigin: true,
    onProxyRes: (res) => {
      delete res.headers['set-cookie'];
    },
    headers: {
      'accept': 'application/vnd.csp-anz.com+json;version=1.0',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'anz-application-id': 'ANZ-AU-COLA',
      'anz-application-version': '1.0',
      'anz-request-id': '0ebdb3c4-30dc-44de-949c-7c985e579c0a',
      'authorization': auth,
      'cache-control': 'no-cache',
      'evtokenretrievalcallinprocess': 'false',
      'evtokenretrievalerror': '',
      'evverificationtoken': '',
      'expiresat': '1570665508',
      'origapp': 'COLA',
      'pragma': 'no-cache',
      'referer': 'https://creditcardapp.anz.com/',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      'uuid': 'c7d80c92-e957-4997-82b4-6cde3cfd4fd5',
      'x-application-context': 'ANZ-AU-COLA/1.0',
      'x-b3-traceid': '0ebdb3c4-30dc-44de-949c-7c985e579c0a',
    },
  }));
})();

app.listen(8080);
